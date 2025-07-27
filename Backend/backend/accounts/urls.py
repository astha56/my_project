from django.urls import path
from django.contrib.auth import authenticate, login
from .views import RegisterView, LoginView
from django.http import JsonResponse
from .views import RestaurantListAPI
from .views import RestaurantDetailAPIView
from .views import CartView
import json

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
]

