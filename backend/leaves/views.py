from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.models import UserDetails
from rest_framework import status
from leaves.models import Leave
from leaves.serializers import LeaveSerializer
from dateutil import parser
from django.core.files import File
from django.http import HttpResponse
from backend.settings import BASE_DIR, MEDIA_ROOT
import smtplib
from email.message import EmailMessage
# Create your views here.
import xlsxwriter

EMAIL_ADDRESS = 'elmspleasedonoreply@gmail.com'
EMAIL_PASSWORD = 'AYUSh@12345'


class LeavesView(APIView):
    def get(self, request, username):
        user = UserDetails.objects.get(username=username)
        leaves = user.leave_set.all().order_by('applied_on').reverse()

        all_leaves = LeaveSerializer(leaves, many=True).data
        for leave in all_leaves:
            leave['name'] = user.first_name+' '+user.last_name

        # if not leaves.exists():
        #     return Response({'status': 'No Leaves'}, status=status.HTTP_200_OK)

        return Response(all_leaves, status=status.HTTP_200_OK)

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
        # _files = request.files

        user = UserDetails.objects.get(username=username)

        if user.leave_balance > 0:
            leave = Leave(leave_type=leave_type, employee=user,
                          admin=admin, manager=manager, from_date=from_date, to_date=to_date, number_of_days=number_of_days, purpose=purpose, address_during_leave=address_during_leave, status='Waiting For Approval from Admin')
            leave.save()
            user.leave_balance -= 1
            user.leaves_month += 1
            user.leaves_total += 1
            user.save()
            return Response({'successMessage': 'Successfully Applied Leave', 'leave_balance': user.leave_balance})
        else:
            return Response({'errorMessage': 'No Leave Balance'})


class CancelLeaveView(APIView):
    def delete(self, request):
        username = request.data.get('username')
        leave_id = request.data.get('leave_id')

        user = UserDetails.objects.get(username=username)
        leave = Leave.objects.get(id=leave_id)

        if leave.waiting_approval:
            leave.delete()
            user.leave_balance += 1
            user.leaves_month -= 1
            user.leaves_total -= 1
            user.save()
            return Response({'successMessage': 'Leave Canceled Successfully'})
        else:
            return Response({'errorMessage': 'Leave Approved by Admin, Can not Cancel Now'})


class GetLeavesForManagerView(APIView):
    def get(self, request, username):
        query_set = Leave.objects.filter(
            manager=username).order_by('applied_on').reverse()

        leaves = []
        for leave in query_set:
            if leave.admin_approved:
                leave_data = LeaveSerializer(leave).data
                leave_data['name'] = leave.employee.first_name + \
                    ' '+leave.employee.last_name
            leave_data['is_online'] = leave.employee.online
            leaves.append(leave_data)
        return Response(leaves)


class GetLeavesForAdminView(APIView):
    def get(self, request, username):
        query_set = Leave.objects.filter(
            admin=username).order_by('applied_on').reverse()

        leaves = []
        for leave in query_set:
            # if not leave.admin_approved:
            leave_data = LeaveSerializer(leave).data
            leave_data['name'] = leave.employee.first_name + \
                ' '+leave.employee.last_name
            leave_data['is_online'] = leave.employee.online
            leaves.append(leave_data)
        return Response(leaves)


class GetAllLeavesView(APIView):
    def get(self, request):
        query_set = Leave.objects.all().order_by('applied_on').reverse()

        leaves = []
        for leave in query_set:
            # if not leave.admin_approved:
            leave_data = LeaveSerializer(leave).data
            leave_data['name'] = leave.employee.first_name + \
                ' '+leave.employee.last_name
            leave_data['is_online'] = leave.employee.online
            leaves.append(leave_data)
        return Response(leaves)


class LeaveAdminApproveView(APIView):
    def post(self, request):
        leave_id = request.data.get('leave_id')
        leave = Leave.objects.get(id=leave_id)

        leave.waiting_approval = False
        leave.admin_approved = True
        leave.status = 'Approved by Admin'

        leave.save()

        msg = EmailMessage()
        msg['Subject'] = 'LMS: Admin Approved'
        msg['From'] = EMAIL_ADDRESS
        print(f"Sending EMAIL to {leave.employee.email}")
        msg['To'] = leave.employee.email
        msg.set_content(
            f'Dear {leave.employee.first_name},\n\nThe leave application applied on {leave.applied_on} from date {leave.from_date} to {leave.to_date} has been approved by the admin.')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return Response({'successMessage': 'Leave Forwarded Successfully'})


class LeaveAdminRejectView(APIView):
    def post(self, request):
        leave_id = request.data.get('leave_id')
        leave = Leave.objects.get(id=leave_id)

        leave.waiting_approval = False
        leave.admin_approved = False
        leave.status = 'Rejected by Admin'
        leave.employee.leave_balance += 1
        leave.employee.leaves_month -= 1
        leave.employee.leaves_total -= 1

        leave.save()

        msg = EmailMessage()
        msg['Subject'] = 'LMS: Admin Rejected'
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = leave.employee.email
        msg.set_content(
            f'Dear {leave.employee.first_name},\n\nThe leave application applied on {leave.applied_on} from date {leave.from_date} to {leave.to_date} has been rejected by the admin.')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return Response({'successMessage': 'Leave Rejected Successfully'})


class LeaveManagerApproveView(APIView):
    def post(self, request):
        leave_id = request.data.get('leave_id')
        leave = Leave.objects.get(id=leave_id)

        leave.waiting_approval = False
        leave.admin_approved = True
        leave.manager_approved = True
        leave.status = 'Approved by Manager'

        leave.save()

        msg = EmailMessage()
        msg['Subject'] = 'LMS: Manager Approved'
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = leave.employee.email
        msg.set_content(
            f'Dear {leave.employee.first_name},\n\nThe leave application applied on {leave.applied_on} from date {leave.from_date} to {leave.to_date} has been approved by the manager.')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        # Send Email to the leave.employee.email that the leave is approved from the manager

        return Response({'successMessage': 'Leave Approved Successfully'})


class LeaveManagerRejectView(APIView):
    def post(self, request):
        leave_id = request.data.get('leave_id')
        leave = Leave.objects.get(id=leave_id)

        leave.waiting_approval = False
        leave.admin_approved = True
        leave.manager_rejected = True
        leave.status = 'Rejected by Manager'
        leave.employee.leave_balance += 1
        leave.employee.leaves_month -= 1
        leave.employee.leaves_total -= 1

        leave.save()

        msg = EmailMessage()
        msg['Subject'] = 'LMS: Manager Rejected'
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = leave.employee.email
        msg.set_content(
            f'Dear {leave.employee.first_name},\n\nThe leave application applied on {leave.applied_on} from date {leave.from_date} to {leave.to_date} has been rejected by the manager.')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return Response({'successMessage': 'Leave Rejected Successfully'})


class LeavesByEmployeeID (APIView):
    def get(self, request, empID):
        employee = UserDetails.objects.get(employee_id=empID)
        query_set = Leave.objects.all().filter(
            employee=employee.id).order_by('applied_on').reverse()
        return Response(LeaveSerializer(query_set, many=True).data)


class LeavesByDepartment (APIView):
    def get(self, request, dept):
        employees = UserDetails.objects.all().filter(
            department_code=dept).filter(is_employee=True)
        leave_by_dept = []
        for employee in employees:
            query_set = Leave.objects.all().filter(
                employee=employee.id).order_by('applied_on').reverse()
            leave_by_dept.append(LeaveSerializer(query_set, many=True).data)
            # leave_by_dept.append(query_set)
        return Response(leave_by_dept)


class LeavesByLeaveType (APIView):
    def get(self, request, leaveType):
        query_set = Leave.objects.all().filter(
            leave_type=leaveType).order_by('applied_on').reverse()
        return Response(LeaveSerializer(query_set, many=True).data)


class DeptPieChartData (APIView):
    def get(self, request):
        leaves = Leave.objects.all()
        ans = {}
        for leave in leaves:
            if leave.employee.department_code in ans.keys():
                ans[leave.employee.department_code] += 1
            else:
                ans[leave.employee.department_code] = 1
        return Response(ans)


class GenerateReportView (APIView):
    def post(self, request):
        data = request.data
        leaveIds = data['leaveIds']

        # query_set = Leave.objects.all().filter(employee=empId)
        leaves = []

        for leaveId in leaveIds:
            leave = Leave.objects.get(id=leaveId)
            leaves.append(leave)

        workbook = xlsxwriter.Workbook('media/report.xlsx')

        cell_format = workbook.add_format()
        cell_format.set_bold()

        date_format = workbook.add_format({'num_format': 'd mmmm yyyy'})

        worksheet = workbook.add_worksheet()

        worksheet.write(0, 0, 'ID', cell_format)
        worksheet.write(0, 1, 'Employee Name', cell_format)
        worksheet.write(0, 2, 'Leave Type', cell_format)
        worksheet.write(0, 3, 'Applied On', cell_format)
        worksheet.write(0, 4, 'Leave From', cell_format)
        worksheet.write(0, 5, 'Leave To', cell_format)
        worksheet.write(0, 6, 'Assigned Admin', cell_format)
        worksheet.write(0, 7, 'Assigned Manager', cell_format)

        print(leaves[0].applied_on)

        for row_no, row in enumerate(leaves):
            worksheet.write(row_no+1, 0, row.id)
            worksheet.write(row_no+1, 1, row.employee.first_name +
                            ' '+row.employee.last_name)
            worksheet.write(row_no+1, 2, row.leave_type)
            worksheet.write(row_no+1, 3, row.applied_on.strftime('%d/%m/%Y'))
            worksheet.write(
                row_no+1, 4, row.from_date.strftime('%d/%m/%Y'))
            worksheet.write(
                row_no+1, 5, row.to_date.strftime('%d/%m/%Y'))
            worksheet.write(row_no+1, 6, row.admin)
            worksheet.write(row_no+1, 7, row.manager)

        workbook.close()

        path_to_file = MEDIA_ROOT + '/report.xlsx'
        f = open(path_to_file, 'rb')
        pdfFile = File(f)
        response = HttpResponse(pdfFile.read())
        response['Content-Disposition'] = 'attachment'
        return response


class FileUploadView (APIView):
    def post(self, request):
        # for i in dir(request):
        #     if i[0] != '_' and not i.isupper():
        #         print(f"{i} --> request.{i} and it contains", end=' ')
        #         exec(f"print(request.{i})")
        print(request.FILES)

        return Response({})
