from django.db import models
from django.contrib.auth.hashers import make_password
    
class User(models.Model):
    USER_TYPE_CHOICES = (
        ('R', 'Recruteur'),
        ('E', 'Chercheur d\'emploi'),
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=128)
    date_of_birth = models.DateField(default='2000-01-01')
    user_type = models.CharField(max_length=1, choices=USER_TYPE_CHOICES,default='E')
    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)

class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    website = models.TextField()
    logo = models.ImageField(upload_to='logos/')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class JobSeeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    degree = models.CharField(max_length=255)
    speciality = models.CharField(max_length=255)

class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField()
    applied_at = models.DateTimeField(auto_now_add=True)

class Resume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')


    