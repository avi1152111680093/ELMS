from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Department
from rest_framework import status
from .serializers import DepartmentSerializer
from accounts.models import UserDetails
from accounts.serializers import UserDetailsSerializer
# Create your views here.


class AddDepartmentView(APIView):
    def get(self, request):
        query_set = Department.objects.all().order_by('created_on')
        serializer = DepartmentSerializer(query_set, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        dept_name = data['dept_name']
        dept_code = data['dept_code']
        # if (Department.objects.get(dept_name=dept_name) != None):
        #     return Response({
        #         'status': 'name exists'
        #     }, status=status.HTTP_200_OK)

        # if (Department.objects.get(dept_code=dept_code) != None):
        #     return Response({
        #         'status': 'code exists'
        #     }, status=status.HTTP_200_OK)

        department = Department(dept_name=dept_name, dept_code=dept_code)
        department.save()

        serializer = DepartmentSerializer(department)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetDepartmentView(APIView):
    def get(self, request, dept_code):
        dept = Department.objects.get(dept_code=dept_code)
        return Response(DepartmentSerializer(dept).data)


class NumberOfEmployeesInDept(APIView):
    def get(self, request, dept_code):
        query_set = UserDetails.objects.all().filter(
            department_code=dept_code).filter(is_employee=True)
        return Response(UserDetailsSerializer(query_set, many=True).data)


class NumberOfDepartmentView(APIView):
    def get(self, request):
        query_set = Department.objects.all()
        return Response({'length': len(query_set)}, status=status.HTTP_200_OK)


class UpdateDepartmentView (APIView):
    def put(self, request, pk):
        data = request.data
        dept_name = data['dept_name']
        dept_code = data['dept_code']

        department = Department.objects.get(dept_code=pk)
        department.dept_name = dept_name
        department.dept_code = dept_code

        department.save()

        return Response(data, status=status.HTTP_200_OK)
