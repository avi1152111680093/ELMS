from django.urls import path

from leaves.views import CancelLeaveView, FileUploadView, GenerateReportView, GetLeavesForAdminView, GetLeavesForManagerView, LeaveAdminApproveView, LeaveAdminRejectView, LeaveManagerApproveView, LeaveManagerRejectView, LeavesByDepartment, LeavesByEmployeeID, LeavesByLeaveType, LeavesView, GetAllLeavesView, DeptPieChartData

urlpatterns = [
    path('get-leaves/<str:username>/', LeavesView.as_view()),
    path('get-manager-leaves/<str:username>/',
         GetLeavesForManagerView.as_view()),
    path('get-admin-leaves/<str:username>/', GetLeavesForAdminView.as_view()),
    path('get-all-leaves/', GetAllLeavesView.as_view()),
    path('apply-leave/', LeavesView.as_view()),
    path('delete-leave/', CancelLeaveView.as_view()),
    path('leave-admin-approve/', LeaveAdminApproveView.as_view()),
    path('leave-admin-reject/', LeaveAdminRejectView.as_view()),
    path('leave-manager-approve/', LeaveManagerApproveView.as_view()),
    path('leave-manager-reject/', LeaveManagerRejectView.as_view()),
    path('filter-leaves-empid/<str:empID>/', LeavesByEmployeeID.as_view()),
    path('filter-leaves-dept/<str:dept>/', LeavesByDepartment.as_view()),
    path('filter-leaves-leaveType/<str:leaveType>/', LeavesByLeaveType.as_view()),
    path('pie-chart-data/', DeptPieChartData.as_view()),
    path('generate-report', GenerateReportView.as_view()),
    path('file-upload', FileUploadView.as_view())
]
