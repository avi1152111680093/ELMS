import ssl
from os import stat
from django.http import HttpResponseRedirect
from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializer, UserDetailsSerializer
from .models import UserDetails
import string
import random
import datetime
from django.contrib.auth import authenticate, login, logout
import smtplib
from dateutil.relativedelta import relativedelta
from email.message import EmailMessage
# Create your views here


def send_email(email, username, password):
    msg = EmailMessage()
    msg['Subject'] = 'ELMS: User Registered Successfully'
    port = 465
    sender_password = 'AYUSh@12345'
    login_link = "http://localhost:3000/login"
    sent_from = 'elmspleasedonoreply@gmail.com'

    msg['From'] = sent_from
    msg['To'] = email

    msg.set_content(
        f'Username: {username}\nPassword: {password}\nClick Here: {login_link}')

    # Create a secure SSL context
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', port=port) as smtp:
        smtp.login(sent_from, sender_password)
        smtp.send_message(msg)
    print(f"Sent EMAIL to {email}")


def generate_password():
    random_source = string.ascii_letters + string.digits
    # select 1 lowercase
    password = random.choice(string.ascii_lowercase)
    # select 1 uppercase
    password += random.choice(string.ascii_uppercase)
    # select 1 digit
    password += random.choice(string.digits)
    # select 1 special symbol
    password += random.choice(string.punctuation)

    # generate other characters
    for i in range(6):
        password += random.choice(random_source)

    password_list = list(password)
    # shuffle all characters
    random.SystemRandom().shuffle(password_list)
    password = ''.join(password_list)
    return password


class RegisterEmployeeView (APIView):
    def get(self, request, format=None):
        queryset = User.objects.all()
        employees = []
        if not queryset.exists():
            return Response({'status': 'No Employees'}, status=status.HTTP_200_OK)
        for user in queryset:
            user_details = UserDetails.objects.get(username=user.username)
            if user_details.is_employee:
                employees.append(user_details)
        users = UserDetailsSerializer(employees, many=True)
        return Response(users.data)

    def post(self, request, format=None):
        username = request.data.get('username')
        user = User.objects.filter(username=username)
        user_details = UserDetails.objects.filter(username=username)
        if user.exists() and user_details.exists():
            user_details = user_details[0]
            user_details.is_employee = True
            user_details.save()
            return Response({
                'status': 'success'
            }, status=status.HTTP_200_OK)

        password = generate_password()
        is_employee = True
        is_admin = False
        is_manager = False
        first_name = request.data.get('first_name')
        employee_id = request.data.get('employee_id')
        last_name = request.data.get('last_name')
        year, month, day = request.data.get('dob').split('-')
        dob = datetime.date(int(year), int(month), int(day))
        department_code = request.data.get('department_code')
        phone_number = request.data.get('phone_number')
        year, month, day = request.data.get('joining_date').split('-')
        joining_date = datetime.date(int(year), int(month), int(day))
        flat = request.data.get('flat')
        town = request.data.get('town')
        state = request.data.get('state')
        admin = request.data.get('admin')
        manager = request.data.get('manager')
        online = False
        email = request.data.get('email')
        contract_based = request.data.get('contract')
        regular_based = request.data.get('regular')
        if contract_based:
            leave_balance = 10
        if regular_based:
            leave_balance = 30

        user = User.objects.create_user(username=username, password=password)
        user.save()

        user_details = UserDetails.objects.create(username=username, employee_id=employee_id, is_employee=is_employee, is_admin=is_admin, is_manager=is_manager, first_name=first_name,
                                                  last_name=last_name, dob=dob, department_code=department_code, phone_number=phone_number, joining_date=joining_date, flat=flat, town=town, state=state, online=online, admin=admin, manager=manager, contract_based=contract_based, regular_based=regular_based, leave_balance=leave_balance, email=email)
        user_details.save()

        try:
            send_email(email, username, password)
        except:
            print('Something Error happened sending mail to the created user')

        return Response({'status': 'success', 'username': f'{username}', 'temp_password': f'{password}'}, status=status.HTTP_200_OK)


class UpdateEmployeeView (APIView):
    def put(self, request, pk):
        user_details = UserDetails.objects.get(username=pk)
        first_name = request.data.get('first_name')
        employee_id = request.data.get('employee_id')
        last_name = request.data.get('last_name')
        department_code = request.data.get('department_code')
        phone_number = request.data.get('phone_number')
        flat = request.data.get('flat')
        town = request.data.get('town')
        state = request.data.get('state')

        user_details.employee_id = employee_id
        user_details.last_name = last_name
        user_details.department_code = department_code
        user_details.phone_number = phone_number
        user_details.first_name = first_name
        user_details.flat = flat
        user_details.town = town
        user_details.state = state

        user_details.save()

        return Response(UserDetailsSerializer(user_details).data, status=status.HTTP_200_OK)


class DeleteEmployeeView (APIView):
    def delete(self, request, pk):
        user_details = UserDetails.objects.get(username=pk)
        # user.delete()
        # user_details.delete()
        user_details.disabled = True
        user_details.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class NumberOfEmployees(APIView):
    def get(self, request):
        users = UserDetails.objects.all()
        if users.exists():
            count = 0
            for user in users:
                if user.is_employee:
                    count += 1
            return Response({'length': count}, status=status.HTTP_200_OK)
        return Response({'length': 0}, status=status.HTTP_200_OK)


class LoginUser(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role')

        if username == "":
            return Response({'errors': ['Username field empty!']}, status=status.HTTP_200_OK)
        if password == "":
            return Response({'errors': ['Password field empty!']}, status=status.HTTP_200_OK)
        if role == "":
            return Response({'errors': ['Role field empty!']}, status=status.HTTP_200_OK)

        user = authenticate(username=username, password=password)

        if user is not None:
            user_detail = UserDetails.objects.get(username=username)
            if user_detail.disabled:
                return Response({'errors': ['Account has been disabled! Contact Admin.']}, status=status.HTTP_200_OK)
            user_detail.online = True
            user_detail.save()
            if role == 0 and not user_detail.is_employee:
                return Response({'errors': ['User does not have Employee role!']}, status=status.HTTP_200_OK)
            if role == 1 and not user_detail.is_admin:
                return Response({'errors': ['User does not have Admin role!']}, status=status.HTTP_200_OK)
            if role == 2 and not user_detail.is_manager:
                return Response({'errors': ['User does not have Manager role!']}, status=status.HTTP_200_OK)
            user_detail = UserDetailsSerializer(user_detail).data
            login(request, user)
            print(request.user)
            # remove
            # send_email('avinash.kumar.18001@iitgoa.ac.in', 'avi', 'temp')
            return Response({'user': user_detail})
        else:
            return Response({'errors': ['User does not exists!']}, status=status.HTTP_200_OK)


class LogoutUser(APIView):
    def post(self, request):
        username = request.data.get('username')

        user = UserDetails.objects.get(username=username)

        _user = User.objects.get(username=username)

        login(request, _user)

        user.online = False
        user.save()

        logout(request)

        return Response({'successMessage': 'Successfully Logged Out'})


class AddManagerView (APIView):
    def post(self, request):
        username = request.data.get('username')
        user = User.objects.filter(username=username)
        user_details = UserDetails.objects.filter(username=username)
        if user.exists() and user_details.exists():
            user_details = user_details[0]
            user_details.is_manager = True
            user_details.save()
            return Response({
                'status': 'success'
            }, status=status.HTTP_200_OK)
        # elif user.exists():
        #     is_employee = False
        #     is_admin = True
        #     is_manager = False
        #     first_name = request.data.get('first_name')
        #     last_name = request.data.get('last_name')
        #     employee_id = request.data.get('employee_id')
        #     year, month, day = request.data.get('dob').split('/')
        #     dob = datetime.date(int(year), int(month), int(day))
        #     department_code = request.data.get('department_code')
        #     phone_number = request.data.get('phone_number')
        #     leave_balance = int(request.data.get('leave_balance'))
        #     year, month, day = request.data.get('joining_date').split('/')
        #     joining_date = datetime.date(int(year), int(month), int(day))
        #     online = False

        #     user_details = UserDetails.objects.create(username=username, employee_id=employee_id, is_employee=is_employee, is_admin=is_admin, is_manager=is_manager, first_name=first_name,
        #                                               last_name=last_name, dob=dob, department_code=department_code, phone_number=phone_number, leave_balance=leave_balance, joining_date=joining_date, online=online)
        #     user_details.save()

        #     return Response({'status': 'success'}, status=status.HTTP_200_OK)

        password = generate_password()
        is_employee = False
        is_admin = False
        is_manager = True
        first_name = request.data.get('first_name')
        employee_id = request.data.get('employee_id')
        last_name = request.data.get('last_name')
        year, month, day = request.data.get('dob').split('-')
        dob = datetime.date(int(year), int(month), int(day))
        department_code = request.data.get('department_code')
        phone_number = request.data.get('phone_number')
        year, month, day = request.data.get('joining_date').split('-')
        joining_date = datetime.date(int(year), int(month), int(day))
        flat = request.data.get('flat')
        town = request.data.get('town')
        state = request.data.get('state')
        online = False

        user = User.objects.create_user(username=username, password=password)
        user.save()

        user_details = UserDetails.objects.create(username=username, employee_id=employee_id, is_employee=is_employee, is_admin=is_admin, is_manager=is_manager, first_name=first_name,
                                                  last_name=last_name, dob=dob, department_code=department_code, phone_number=phone_number, joining_date=joining_date, flat=flat, town=town, state=state, online=online)
        user_details.save()

        return Response({'status': 'success', 'username': f'{username}', 'temp_password': f'{password}'}, status=status.HTTP_200_OK)


class GetAssignedNamesView(APIView):
    def post(self, request):
        username = request.data.get('username')
        user = UserDetails.objects.get(username=username)
        admin_username = user.admin
        manager_username = user.manager
        admin = UserDetails.objects.get(username=admin_username)
        manager = UserDetails.objects.get(username=manager_username)
        return Response({'admin': admin.first_name+' '+admin.last_name, 'manager': manager.first_name+' '+manager.last_name})


class GetUserDetailsView(APIView):
    def post(self, request):
        username = request.data.get('username')
        user = UserDetails.objects.get(username=username)

        return Response(UserDetailsSerializer(user).data)


class ChangePasswordView (APIView):
    def post(self, request):
        username = request.data.get('username')
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        user = User.objects.get(username=username)

        print(user.check_password(old_password))

        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return Response({'successMessage': 'Password Changed Successfully!'})
        return Response({'errorMessage': 'Wrong Old Password!'})


class GetManagersView (APIView):
    def get(self, request):
        query_set = UserDetails.objects.filter(is_manager=True)
        return Response(UserDetailsSerializer(query_set, many=True).data)


class GetAdminsView (APIView):
    def get(self, request):
        query_set = UserDetails.objects.filter(is_admin=True)
        return Response(UserDetailsSerializer(query_set, many=True).data)


class GetUserDetailsByEmpID (APIView):
    def get(self, request, empID):
        user = UserDetails.objects.get(employee_id=empID)
        return Response(UserDetailsSerializer(user).data)
