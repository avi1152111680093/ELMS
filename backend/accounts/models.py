from django.db import models

# Create your models here.


class UserDetails(models.Model):
    username = models.TextField(max_length=50, unique=True)
    employee_id = models.TextField(max_length=50, default='')
    is_employee = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    first_name = models.TextField(max_length=50)
    last_name = models.TextField(max_length=50)
    dob = models.DateField(null=True)
    department_code = models.TextField(max_length=10, null=True)
    phone_number = models.TextField(max_length=10, null=True)
    leave_balance = models.IntegerField(default=30, null=True)
    joining_date = models.DateField(null=True)
    online = models.BooleanField(default=False, null=True)
    flat = models.TextField(max_length=50, default='')
    town = models.TextField(max_length=50, default='')
    state = models.TextField(max_length=50, default='')
    manager = models.TextField(max_length=50, default='')
    admin = models.TextField(max_length=50, default='')
    email = models.EmailField(default='')
    contract_based = models.BooleanField(default=False)
    regular_based = models.BooleanField(default=False)
    leaves_month = models.IntegerField(default=0)
    leaves_total = models.IntegerField(default=0)
    disabled = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username
