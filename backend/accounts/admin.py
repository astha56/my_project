from django.contrib import admin
from .models import Restaurant, MenuItem 
from .models import Product, CartItem

admin.site.register(Product)
admin.site.register(CartItem)

admin.site.register(Restaurant)
admin.site.register(MenuItem)  

# Register your models here.
