from django.shortcuts import render

from accounts.models import UserDetails
from rest_framework.views import APIView
from rest_framework.response import Response

from notifications.serializers import NotificationSerializer
# Create your views here.


class GetNotificationsView(APIView):
    def get(self, request, username):
        user = UserDetails.objects.get(username=username)
        notifications = user.notification_set.all().filter(
            seen=False).order_by('created_on').reverse()
        return Response(NotificationSerializer(notifications, many=True).data)
