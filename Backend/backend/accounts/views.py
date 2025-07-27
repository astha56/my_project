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
        # Remove item from cart
        product_id = request.data.get('product_id')
        try:
            cart_item = CartItem.objects.get(user=request.user, product_id=product_id)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        



# Create your views here.
