from django.urls import path
from .views import AddDepartmentView, NumberOfDepartmentView

urlpatterns = [
    path('add-dept', AddDepartmentView.as_view()),
    path('number-dept', NumberOfDepartmentView.as_view())
]
