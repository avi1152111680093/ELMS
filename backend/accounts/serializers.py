from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User

from accounts.models import UserDetails


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserDetailsSerializer(ModelSerializer):
    class Meta:
        model = UserDetails
        fields = '__all__'
