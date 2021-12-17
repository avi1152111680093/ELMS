from django.urls import path

from leaves.views import CancelLeaveView, GetLeavesForAdminView, GetLeavesForManagerView, LeavesView

urlpatterns = [
    path('get-leaves/<str:username>/', LeavesView.as_view()),
    path('get-manager-leaves/<str:username>/',
         GetLeavesForManagerView.as_view()),
    path('get-admin-leaves/<str:username>/', GetLeavesForAdminView.as_view()),
    path('apply-leave/', LeavesView.as_view()),
    path('delete-leave/', CancelLeaveView.as_view())
]
