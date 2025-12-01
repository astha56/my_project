from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet
from django.urls import path, include
from django.urls import path
from django.contrib.auth import authenticate, login
from .views import RegisterView, LoginView
from django.http import JsonResponse
from .views import RestaurantListAPI
from .views import RestaurantDetailAPIView
from .views import CartView
import json
from .views import OrderCreateView
from .views import CustomerCheckoutView
from .views import CustomerOrderListCreateView
from . import views


router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)


def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({'error': 'Username and password required'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    login(request, user)
    return JsonResponse({'message': 'Login successful'}, status=200)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('restaurants/', RestaurantListAPI.as_view(), name='restaurant-list'),
    path('restaurants/<int:pk>/', RestaurantDetailAPIView.as_view(), name='restaurant-detail'),
    path('cart/', CartView.as_view(), name='cart'),
    path('', include(router.urls)), 
    path('orders/', OrderCreateView.as_view(), name='order-create'), 
    path('customer-checkout/', CustomerCheckoutView.as_view(), name='customer-checkout'),
    path('orders/new/', CustomerOrderListCreateView.as_view(), name='orders-list-create'),
    path("create-payment-intent/", views.create_payment_intent, name="create-payment-intent"),
    path('api/stripe-webhook/', views.stripe_webhook, name='stripe-webhook'),
     path('api/customers/', views.customers_list, name='customers-list'),
     path('restaurant/<int:restaurant_id>/orders/', views.restaurant_orders, name='restaurant-orders'),
    path('restaurant/<int:restaurant_id>/reviews/', views.restaurant_reviews, name='restaurant-reviews'),
]


