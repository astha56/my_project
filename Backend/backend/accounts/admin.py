from django.contrib import admin
from .models import Restaurant, MenuItem 
from .models import Product, CartItem
from .models import Review
from .models import CustomerOrder, CustomerOrderItem


class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_name', 'get_product_name', 'quantity')

    def get_user_name(self, obj):
        return obj.user.username
    get_user_name.short_description = 'User Name'

    def get_product_name(self, obj):
        return obj.product.name
    get_product_name.short_description = 'Product Name'

admin.site.register(Product)
admin.site.register(CartItem)

admin.site.register(Restaurant)
admin.site.register(MenuItem)  
admin.site.register(Review)


admin.site.register(CustomerOrder)
admin.site.register(CustomerOrderItem)

# Register your models here.
