from django.urls import path
from .views import AddLeaveTypeView, DeleteLeaveTypeView, EditLeaveTypeView, GetLeaveTypeContractView, GetLeaveTypeRegularView, NumberOfLeaveTypeView, LeaveTypePieChartData, GetLeaveTypeByName

urlpatterns = [
    path('add-leave-type', AddLeaveTypeView.as_view()),
    path('number-leave-types', NumberOfLeaveTypeView.as_view()),
    path('delete-leave-types/<str:pk>', DeleteLeaveTypeView.as_view()),
    path('update-leave-type/<str:pk>', EditLeaveTypeView.as_view()),
    path('get-leave-type-regular', GetLeaveTypeRegularView.as_view()),
    path('get-leave-type-contract', GetLeaveTypeContractView.as_view()),
    path('pie-chart-data/', LeaveTypePieChartData.as_view()),
    path('get-by-name/<str:name>', GetLeaveTypeByName.as_view())
]
