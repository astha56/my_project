from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from .models import Restaurant
from .serializers import RestaurantSerializer
from rest_framework import generics
from .models import CartItem, Product
from .serializers import CartItemSerializer
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .serializers import ReviewSerializer
from .models import Review
from rest_framework import generics, permissions
from django.views.decorators.csrf import csrf_exempt
from .serializers import OrderSerializer
from .models import Order
from .models import CustomerOrder, MenuItem, CustomerOrderItem
from .serializers import CustomerOrderSerializer
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def checkout_view(request):
    ...

class CartView(APIView):
    permission_classes = [AllowAny] 


class RestaurantListAPI(APIView):
    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request):
        print("Received data:", request.data)               # Show received payload
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registered successfully'}, status=201)
        print("Errors:", serializer.errors)                 # Show validation errors
        return Response(serializer.errors, status=400)
    


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            return Response({"message": "Login successful", "username": user.username}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RestaurantDetailAPIView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Add or update cart item
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if quantity < 1:
            return Response({'error': 'Quantity must be at least 1'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)
        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request):
       
        product_id = request.data.get('product_id')
        try:
            cart_item = CartItem.objects.get(user=request.user, product_id=product_id)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


    
class OrderCreateView(APIView):
    def get(self, request):
        # For example: return all orders (or a message)
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            return Response({'message': 'Order saved successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Create your views here.

from .serializers import CustomerOrderSerializer

# List all orders or create a new order
class CustomerOrderListCreateView(generics.ListCreateAPIView):
    queryset = CustomerOrder.objects.all()
    serializer_class = CustomerOrderSerializer


class CustomerCheckoutView(APIView):
    permission_classes = [AllowAny]  # no auth required

    def post(self, request):
        data = request.data
        full_name = data.get('full_name')
        delivery_address = data.get('delivery_address')
        phone_number = data.get('phone_number')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        items = data.get('items', [])

        if not items:
            return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

        # get total_cost from frontend (includes delivery + tax)
        total_cost = data.get('total_cost')
        if total_cost is None:
            total_cost = sum(item['quantity'] * item['price'] for item in items)

        order = CustomerOrder.objects.create(
            full_name=full_name,
            delivery_address=delivery_address,
            phone_number=phone_number,
            latitude=latitude,
            longitude=longitude,
            total_cost=total_cost,
            user=None  # or request.user if logged in
        )

        for item in items:
            menu_item = MenuItem.objects.get(id=item['product_id'])
            CustomerOrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=item['quantity'],
                price=item['price']
            )

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_cost": order.total_cost
        }, status=status.HTTP_201_CREATED)

  
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_payment_intent(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = int(float(data["amount"]))
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="npr",
                automatic_payment_methods={"enabled": True},
            )
            return JsonResponse({"clientSecret": intent.client_secret})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        # Handle GET or other methods
        return JsonResponse({"error": "POST method required"}, status=405)
    
@csrf_exempt
def confirm_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_id = data.get("orderId")
            payment_intent_id = data.get("paymentIntentId")

            order = CustomerOrder.objects.get(id=order_id)
            order.payment_status = "paid"
            order.stripe_payment_intent_id = payment_intent_id
            order.save()

            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    else:
        return JsonResponse({"error": "POST method required"}, status=405)
    
@csrf_exempt
def stripe_webhook(request):
    import stripe
    from django.http import HttpResponse
    from .models import CustomerOrder

    stripe.api_key = "YOUR_STRIPE_SECRET_KEY"
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = "YOUR_STRIPE_ENDPOINT_SECRET"

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception:
        return HttpResponse(status=400)

    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        stripe_id = payment_intent['id']

        try:
            order = CustomerOrder.objects.get(stripe_payment_intent_id=stripe_id)
            order.payment_status = 'paid'
            order.save()
        except CustomerOrder.DoesNotExist:
            pass  # Order not found, maybe log it

    return HttpResponse(status=200)

          
# class CustomerCheckoutView(APIView):
#     permission_classes = [AllowAny]  # no auth required

#     def post(self, request):
#         data = request.data
#         full_name = data.get('full_name')
#         delivery_address = data.get('delivery_address')
#         phone_number = data.get('phone_number')
#         latitude = data.get('latitude')
#         longitude = data.get('longitude')
#         items = data.get('items', [])

#         if not items:
#             return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

#         total_cost = sum(item['quantity'] * item['price'] for item in items)

#         order = CustomerOrder.objects.create(
#             full_name=full_name,
#             delivery_address=delivery_address,
#             phone_number=phone_number,
#             latitude=latitude,
#             longitude=longitude,
#             total_cost=total_cost,
#             user=None  # or request.user if logged in
#         )

#         for item in items:
#             menu_item = MenuItem.objects.get(id=item['menu_item'])
#             CustomerOrderItem.objects.create(
#                 order=order,
#                 menu_item=menu_item,
#                 quantity=item['quantity'],
#                 price=item['price']
#             )

#         return Response({"message": "Order placed successfully"}, status=status.HTTP_201_CREATED)
    
    
    