from rest_framework.serializers import ModelSerializer
from .models import LeaveType


class LeaveTypeSerializer (ModelSerializer):
    class Meta:
        model = LeaveType
        fields = '__all__'
