from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings 

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='product_images/')

class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'product')
        
class CustomUser(AbstractUser):
    # Add custom fields here if needed
    pass
class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()  # <-- new field added
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