from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Department
from rest_framework import status
from .serializers import DepartmentSerializer

# Create your views here.


class AddDepartmentView(APIView):
    def get(self, request):
        query_set = Department.objects.all()
        serializer = DepartmentSerializer(query_set, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        dept_name = data['dept_name']
        dept_code = data['dept_code']

        department = Department(dept_name=dept_name, dept_code=dept_code)
        department.save()

        return Response(data, status=status.HTTP_201_CREATED)


class NumberOfDepartmentView(APIView):
    def get(self, request):
        query_set = Department.objects.all()
        return Response({'length': len(query_set)}, status=status.HTTP_200_OK)
