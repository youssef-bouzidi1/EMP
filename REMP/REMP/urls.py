"""REMP URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework import routers
from EMP import views
from django.conf.urls import include
from EMP.views import login
from EMP.views import register
from EMP.views import get_user
from EMP.views import PostJob
from EMP.views import get_jobs
from . import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()

urlpatterns = [
    path('api', include(router.urls)),
    path('admin/', admin.site.urls),
    path('login/', login.as_view(), name='login'),
    path('register/', register.as_view(), name='register'),
    path('post-job/', PostJob.as_view(), name='post_job'),  # Add the path for posting a job
    path('user/<int:user_id>/', get_user.as_view(), name='get_user'),
    path('job/<int:job_id>/', get_jobs.as_view(), name='get_jobs'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
