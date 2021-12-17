from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LeaveType
from rest_framework import status
from .serializers import LeaveTypeSerializer

# Create your views here.


class AddLeaveTypeView(APIView):
    def get(self, request):
        query_set = LeaveType.objects.all()
        serializer = LeaveTypeSerializer(query_set, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        leave_type_name = data['leave_type_name']
        leave_type_code = data['leave_type_code']

        # if (LeaveType.objects.get(leave_type_name=leave_type_name) != None):
        #     return Response({
        #         'status': 'name exists'
        #     }, status=status.HTTP_200_OK)

        # if (LeaveType.objects.get(leave_type_code=leave_type_code) != None):
        #     return Response({
        #         'status': 'code exists'
        #     }, status=status.HTTP_200_OK)

        leave_type = LeaveType(leave_type_name=leave_type_name,
                               leave_type_code=leave_type_code)
        leave_type.save()

        serializer = LeaveTypeSerializer(leave_type)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DeleteLeaveTypeView (APIView):
    def delete(self, request, pk):
        leave_type = LeaveType.objects.get(leave_type_code=pk)
        leave_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EditLeaveTypeView(APIView):
    def put(self, request, pk):
        data = request.data
        leave_type_name = data['leave_type_name']
        leave_type_code = data['leave_type_code']

        leave_type = LeaveType.objects.get(leave_type_code=pk)
        leave_type.leave_type_name = leave_type_name
        leave_type.leave_type_code = leave_type_code

        leave_type.save()

        return Response(data, status=status.HTTP_200_OK)


class NumberOfLeaveTypeView(APIView):
    def get(self, request):
        query_set = LeaveType.objects.all()
        return Response({'length': len(query_set)}, status=status.HTTP_200_OK)
