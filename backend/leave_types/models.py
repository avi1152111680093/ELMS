from django.db import models

# Create your models here.


class LeaveType(models.Model):
    leave_type_name = models.TextField(max_length=50)
    leave_type_code = models.TextField(max_length=10)
    created_on = models.DateField(auto_now_add=True)
