from django.urls import path
from .views import AddDepartmentView, NumberOfDepartmentView, GetDepartmentView, NumberOfEmployeesInDept, UpdateDepartmentView

urlpatterns = [
    path('add-dept', AddDepartmentView.as_view()),
    path('number-dept', NumberOfDepartmentView.as_view()),
    path('get-dept/<str:dept_code>', GetDepartmentView.as_view()),
    path('number-emp/<str:dept_code>', NumberOfEmployeesInDept.as_view()),
    path('update-dept/<str:pk>', UpdateDepartmentView.as_view())
]
