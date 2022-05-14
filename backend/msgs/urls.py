from django.urls import path

from msgs.views import MessageSendView, MessagesView

urlpatterns = [
    path('<int:leave_id>', MessagesView.as_view()),
    path('send', MessageSendView.as_view())
]
