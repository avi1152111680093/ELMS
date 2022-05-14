from django.db import models

# Create your models here.


class LeaveType(models.Model):
    leave_type_name = models.TextField(max_length=50)
    leave_type_code = models.TextField(max_length=10)
    contract_based = models.BooleanField(null=True)
    regular_based = models.BooleanField(null=True)
    limit = models.IntegerField(null=True)  # In days
    created_on = models.DateTimeField(auto_now_add=True)
