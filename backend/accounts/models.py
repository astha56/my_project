from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings 
import random 

def generate_fake_payment_intent_id():
    return f"pi_{random.randint(1000,9999999)}"
    
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='product_images/')

class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart_items',
        null=True,      
        blank=True
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'product')
        
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('restaurant_owner', 'Restaurant Owner'),
        ('admin', 'Admin'),
    
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    pass

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    
class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()  
    cuisine = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    image = models.ImageField(upload_to='restaurant_images/', blank=True, null=True)
    
    def __str__(self):
        return self.name
    
class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='menu_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_veg = models.BooleanField(default=False)
    description = models.TextField()
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.restaurant.name})"
    
class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='reviews', on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    text = models.TextField()
    rating = models.PositiveSmallIntegerField()
    date = models.DateField(auto_now_add=True)

class Order(models.Model):
    delivery_address = models.CharField(max_length=255)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.delivery_address}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price per unit

    def __str__(self):
        return f"{self.name} (x{self.quantity})"
    
class CustomerOrder(models.Model):
    order_item = models.ForeignKey("CustomerOrderItem", on_delete=models.CASCADE, null=True, blank=True)
    full_name = models.CharField(max_length=100)  
    phone_number = models.CharField(max_length=20)
    delivery_address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)  
    order_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("paid", "Paid"), ("failed", "Failed")],
        default="paid"
    )
    stripe_payment_intent_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        default=generate_fake_payment_intent_id  # auto-generate random ID
    )
    

    def __str__(self):
        return f"CustomerOrder {self.id} - {self.payment_status}"

    def __str__(self):
        return f"CustomerOrder {self.id} (linked to Order {self.order.id})"


class CustomerOrderItem(models.Model):
    order = models.ForeignKey("CustomerOrder", on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # copy from OrderItem

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} (CustomerOrder {self.order.id})"
    
