# Generated by Django 4.2.2 on 2023-07-02 22:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('EMP', '0007_alter_user_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='company',
        ),
    ]
