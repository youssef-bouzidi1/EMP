# Generated by Django 4.1.7 on 2023-05-29 17:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('EMP', '0005_rename_specialty_jobseeker_speciality'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobseeker',
            name='experience',
        ),
    ]
