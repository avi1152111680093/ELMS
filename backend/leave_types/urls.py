from django.urls import path
from .views import AddLeaveTypeView, DeleteLeaveTypeView, EditLeaveTypeView, NumberOfLeaveTypeView

urlpatterns = [
    path('add-leave-type', AddLeaveTypeView.as_view()),
    path('number-leave-types', NumberOfLeaveTypeView.as_view()),
    path('delete-leave-types/<str:pk>', DeleteLeaveTypeView.as_view()),
    path('update-leave-type/<str:pk>', EditLeaveTypeView.as_view())
]
