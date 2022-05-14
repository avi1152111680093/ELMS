from pyexpat import model
from statistics import mode
from django.db import models
from accounts.models import UserDetails

# Create your models here.


class Notification (models.Model):
    type = models.TextField(max_length=50)
    created_on = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
    _from = models.TextField(max_length=50)
    _to = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    description = models.TextField(max_length=100)
