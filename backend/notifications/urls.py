from django.urls import path

from notifications.views import GetNotificationsView

urlpatterns = [
    path('get-notifications/<str:username>/', GetNotificationsView.as_view())
]
