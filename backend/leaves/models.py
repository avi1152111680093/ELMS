from typing import Text
from django.db import models
from django.db.models.fields import DateField, DateTimeField, IntegerField, TextField
from django.db.models.fields.related import OneToOneField
from accounts.models import UserDetails
from leave_types.models import LeaveType
# Create your models here.


class Leave(models.Model):
    leave_type = TextField(max_length=50)
    employee = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    manager = TextField(max_length=50)
    admin = TextField(max_length=50)
    applied_on = DateTimeField(auto_now_add=True)
    from_date = DateField()
    to_date = DateField()
    number_of_days = IntegerField()
    purpose = TextField(max_length=100)
    address_during_leave = TextField(max_length=100)
    status = TextField(max_length=50)
    waiting_approval = models.BooleanField(default=True)
    admin_approved = models.BooleanField(default=False)
    manager_approved = models.BooleanField(default=False)
    manager_rejected = models.BooleanField(default=False)
