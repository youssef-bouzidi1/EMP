from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import User
from .models import Company
from .models import Resume
from .models import JobSeeker
from .models import Job

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','email', 'password']

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'description', 'website', 'logo']

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model= Job
        fields = ['title','description','location','posted_by']

class JobseekerSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(source='resume.resume', required=False)

    class Meta:
        model = JobSeeker
        fields = ['degree', 'speciality', 'resume']

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['resume']

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='company.name', required=False)
    description = serializers.CharField(source='company.description', required=False)
    website = serializers.CharField(source='company.website', required=False)
    logo = serializers.ImageField(source='company.logo', required=False)
    degree = serializers.CharField(required=False)
    speciality = serializers.CharField(required=False)
    resume = serializers.FileField(required=False)

    company = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'user_type', 'company', 'name', 'description', 'website', 'logo', 'degree', 'speciality', 'resume']

    def get_company(self, obj):
        return {
            'name': obj.company.name,
            'description': obj.company.description,
            'website': obj.company.website,
            'logo': obj.company.logo,
        }                                                                                                                                                                                       
    
    def create(self, validated_data):
        company_data = validated_data.pop('company', {})
        name = validated_data.pop('name', None)
        jobseeker_data = {                                      
            'degree': validated_data.pop('degree', None),
            'speciality': validated_data.pop('speciality', None),
            'resume': validated_data.pop('resume', None)
        }                           
        user = User.objects.create(**validated_data)
        if company_data or name:
            Company.objects.create(user=user, name=name, **company_data)
        if jobseeker_data['degree'] or jobseeker_data['speciality'] or jobseeker_data['resume']:
            jobseeker = JobSeeker.objects.create(user=user, **jobseeker_data)
            user.jobseeker = jobseeker
            user.save()
        return user
