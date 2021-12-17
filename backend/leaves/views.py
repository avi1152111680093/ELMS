from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.models import UserDetails
from rest_framework import status
from leaves.models import Leave
from leaves.serializers import LeaveSerializer
from datetime import datetime
from dateutil import parser
# Create your views here.


class LeavesView(APIView):
    def get(self, request, username):
        user = UserDetails.objects.get(username=username)
        leaves = user.leave_set.all()

        # if not leaves.exists():
        #     return Response({'status': 'No Leaves'}, status=status.HTTP_200_OK)

        return Response(LeaveSerializer(leaves, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.data.get('username')
        leave_type = request.data.get('leave_type')
        admin = request.data.get('admin')
        manager = request.data.get('manager')
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')
        purpose = request.data.get('purpose')
        address_during_leave = request.data.get('address_during_leave')
        number_of_days = (parser.parse(to_date)-parser.parse(from_date)).days
        from_date = parser.parse(from_date)
        to_date = parser.parse(to_date)

        user = UserDetails.objects.get(username=username)

        if user.leave_balance > 0:
            leave = Leave(leave_type=leave_type, employee=user,
                          admin=admin, manager=manager, from_date=from_date, to_date=to_date, number_of_days=number_of_days, purpose=purpose, address_during_leave=address_during_leave, status='Waiting For Approval from Admin')
            leave.save()
            user.leave_balance -= 1
            user.save()
            return Response({'successMessage': 'Successfully Applied Leave', 'leave_balance': user.leave_balance})
        else:
            return Response({'errorMessage': 'No Leave Balance'})

# TODO


class CancelLeaveView(APIView):
    def delete(self, request):
        username = request.data.get('username')
        leave_id = request.data.get('leave_id')

        user = UserDetails.objects.get(username=username)
        leave = Leave.objects.get(id=leave_id)


class GetLeavesForManagerView(APIView):
    def get(self, request, username):
        query_set = Leave.objects.filter(manager=username)

        leaves = []
        for leave in query_set:
            if leave.admin_approved:
                leaves.append(leave)
        return Response(LeaveSerializer(leaves, many=True).data)


class GetLeavesForAdminView(APIView):
    def get(self, request, username):
        query_set = Leave.objects.filter(admin=username)

        leaves = []
        for leave in query_set:
            if not leave.admin_approved:
                leaves.append(leave)
        return Response(LeaveSerializer(leaves, many=True).data)
