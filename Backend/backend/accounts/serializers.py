from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Restaurant
from .models import Restaurant, MenuItem
from .models import Product, CartItem
from .models import Review
from .models import Order, OrderItem
from .models import CustomerOrder, CustomerOrderItem

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
    
class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'price', 'is_veg', 'description', 'image']

class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'cuisine', 'location', 'rating', 'image', 'menu_items']
        
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=8, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'user_name',
            'product_name',
            'product_price',
            'product_image',
            'quantity'
        ]

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_id', 'name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'delivery_address', 'total_cost', 'order_date', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
    
class CustomerOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerOrderItem
        fields = ['menu_item', 'quantity', 'price']
        read_only_fields = ['total_cost']
class CustomerOrderSerializer(serializers.ModelSerializer):
    items = CustomerOrderItemSerializer(many=True)

    class Meta:
        model = CustomerOrder
        fields = ['id', 'full_name', 'delivery_address', 'phone_number', 'total_cost', 'latitude', 'longitude', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer_order = CustomerOrder.objects.create(**validated_data)

        # Copy total_cost from Order instance if passed in context
        order = self.context.get('order')
        if order:
            customer_order.total_cost = order.total_cost
            customer_order.save()

        for item_data in items_data:
            CustomerOrderItem.objects.create(order=customer_order, **item_data)

        return customer_order

       
   