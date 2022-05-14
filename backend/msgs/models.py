from django.db import models
from leaves.models import Leave

# Create your models here.


class Message (models.Model):
    leave = models.ForeignKey(Leave, on_delete=models.CASCADE)
    msg_from = models.TextField(max_length=10)
    msg = models.TextField(max_length=200)
    send_on = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
