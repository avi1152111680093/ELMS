from django.db.models import fields
from rest_framework.serializers import ModelSerializer
from .models import Leave


class LeaveSerializer(ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
