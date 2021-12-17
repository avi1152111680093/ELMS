from django.urls import path
from .views import ChangePasswordView, DeleteEmployeeView, GetAdminsView, GetAssignedNamesView, GetManagersView, GetUserDetailsView, LoginUser, NumberOfEmployees, RegisterEmployeeView, UpdateEmployeeView, AddManagerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('register/employee', RegisterEmployeeView.as_view()),
    path('register/manager', AddManagerView.as_view()),
    path('update/<str:pk>', UpdateEmployeeView.as_view()),
    path('delete/<str:pk>', DeleteEmployeeView.as_view()),
    path('number-employees/', NumberOfEmployees.as_view()),
    path('login/', LoginUser.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
    path('get-names/', GetAssignedNamesView.as_view()),
    path('get-admins/', GetAdminsView.as_view()),
    path('get-managers/', GetManagersView.as_view()),
    path('get-user/', GetUserDetailsView.as_view()),
    path('change-password/', ChangePasswordView.as_view())
]
