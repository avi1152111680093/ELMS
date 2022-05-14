from django.urls import path
from .consumers import DeletedUserLogoutConsumer, UpdateUserConsumer


websocket_urlpatterns = [
    path('ws/update-user', UpdateUserConsumer.as_asgi()),
    path('ws/delete-user', DeletedUserLogoutConsumer.as_asgi()),
    # path('ws/update-manager', UpdateUserConsumer.as_asgi()),
    # path('ws/update-employee', UpdateUserConsumer.as_asgi()),
]
