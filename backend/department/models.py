from django.db import models

# Create your models here.


class Department(models.Model):
    dept_name = models.TextField(max_length=50)
    dept_code = models.TextField(max_length=10)
    created_on = models.DateField(auto_now_add=True)