from datetime import datetime
from django.shortcuts import render
from .forms import LoginForm
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import User
from .serializers import LoginSerializer
from .serializers import RegisterSerializer
from .serializers import CompanySerializer
from .serializers import JobSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Company
from .models import JobSeeker
from .models import Resume
from .models import Job
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils import timezone

class login(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                uid=user.id
                return Response({'Login': True,'user_type':user.user_type,'uid':uid})
            else:
                return Response({'Login': False, 'Error': 'Invalid username or password'})
        except User.DoesNotExist:
            return Response({'Login': False, 'Error': 'Invalid username or password'})

    permission_classes = [permissions.AllowAny]


class register(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            user_type = data.get('user_type')
            if user_type == 'R':
                # Create logic for recruiter
                company_name = serializer.validated_data.get('company', {}).get('name')
                description = serializer.validated_data.get('company', {}).get('description')
                website = serializer.validated_data.get('company', {}).get('website')
                logo = serializer.validated_data.get('company', {}).get('logo')
                user = User.objects.create(
                    email=data['email'],
                    password=data['password'],
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    date_of_birth=data['date_of_birth'],
                    user_type=user_type,
                )
                if company_name:  # Check if company_name is not empty
                    Company.objects.create(
                        user=user,
                        name=company_name,
                        description=description,
                        website=website,
                        logo=logo
                    )
            elif user_type == 'E':
                # Create logic for job seeker
                speciality = serializer.validated_data.get('speciality')
                degree = serializer.validated_data.get('degree')
                user = User.objects.create(
                    email=data['email'],
                    password=data['password'],
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    date_of_birth=data['date_of_birth'],
                    user_type=user_type,
                )
                JobSeeker.objects.create(
                        user=user,
                        degree=degree,
                        speciality=speciality,
                    )
                
            # Create logic for resume
            resume_file = serializer.validated_data.get('resume', None)
            if resume_file:
                Resume.objects.create(user=user, file=resume_file)

            return Response({'Register': True, 'id': user.id}, status=status.HTTP_201_CREATED)
        else:
            return Response({'Register': False, 'Error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class get_user(generics.RetrieveAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class PostJob(generics.CreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            posted_by_id = data['posted_by']
            try:
                posted_by = User.objects.get(id=posted_by_id)
            except User.DoesNotExist:
                return Response({'JobPosted': False, 'Error': 'Invalid company ID'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new Job object and set the created_at field to the current time
            job = Job(
                title=data['title'],
                description=data['description'],
                location=data['location'],
                posted_by=posted_by,
                created_at=timezone.now()
            )
            job.save()
            return Response({'JobPosted': True}, status=status.HTTP_201_CREATED)
        else:
            return Response({'JobPosted': False, 'Error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class get_jobs(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    def get(self, request, *args, **kwargs):
        job_id = kwargs.get('job_id')
        try:
            job = Job.objects.filter(posted_by_id=job_id).values()
            return Response(job)
        except Job.DoesNotExist:
            return Response({'Error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    def delete(self, request, *args, **kwargs):
        job_id = kwargs.get('job_id')
        try:
            job = Job.objects.get(id=job_id)
            job.delete()
            return Response({'Success': 'Job deleted'}, status=status.HTTP_200_OK)
        except Job.DoesNotExist:
            return Response({'Error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)


