from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LeaveType
from rest_framework import status
from .serializers import LeaveTypeSerializer
from leaves.models import Leave

# Create your views here.


class AddLeaveTypeView(APIView):
    def get(self, request):
        query_set = LeaveType.objects.all().order_by('created_on').reverse()
        serializer = LeaveTypeSerializer(query_set, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        leave_type_name = data['leave_type_name']
        leave_type_code = data['leave_type_code']
        limit = int(data['limit'])
        contract_based = data['contract_based']
        regular_based = data['regular_based']

        leave_type = LeaveType(leave_type_name=leave_type_name,
                               leave_type_code=leave_type_code,
                               contract_based=contract_based,
                               regular_based=regular_based,
                               limit=limit)
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
        limit = int(data['limit'])

        leave_type = LeaveType.objects.get(leave_type_code=pk)
        leave_type.leave_type_name = leave_type_name
        leave_type.leave_type_code = leave_type_code
        leave_type.limit = limit

        leave_type.save()

        return Response(data, status=status.HTTP_200_OK)


class NumberOfLeaveTypeView(APIView):
    def get(self, request):
        query_set = LeaveType.objects.all()
        return Response({'length': len(query_set)}, status=status.HTTP_200_OK)


class GetLeaveTypeContractView (APIView):
    def get(self, request):
        query_set = LeaveType.objects.filter(contract_based=True)
        return Response(LeaveTypeSerializer(query_set, many=True).data)


class GetLeaveTypeRegularView (APIView):
    def get(self, request):
        query_set = LeaveType.objects.filter(regular_based=True)
        return Response(LeaveTypeSerializer(query_set, many=True).data)


class LeaveTypePieChartData (APIView):
    def get(self, request):
        leaves = Leave.objects.all()
        ans = {}
        for leave in leaves:
            if leave.leave_type in ans.keys():
                ans[leave.leave_type] += 1
            else:
                ans[leave.leave_type] = 1
        return Response(ans)


class GetLeaveTypeByName (APIView):
    def get(self, request, name):
        leave_type = LeaveType.objects.get(leave_type_name=name)
        return Response(LeaveTypeSerializer(leave_type).data)
