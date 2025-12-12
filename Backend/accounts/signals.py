import random
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomerOrder

@receiver(post_save, sender=CustomerOrder)
def auto_mark_paid(sender, instance, created, **kwargs):
    if created:  
        instance.payment_status = "paid"
        instance.stripe_payment_intent_id = f"pi_auto_{instance.id}_{random.randint(1000,9999)}"
        instance.save()
