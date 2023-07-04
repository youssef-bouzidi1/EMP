# Generated by Django 4.1.7 on 2023-05-27 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(default='', max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('password', models.TextField()),
                ('date_of_birth', models.DateField(default='2000-01-01')),
                ('user_type', models.CharField(choices=[('R', 'Recruteur'), ('E', "Chercheur d'emploi")], default='E', max_length=1)),
            ],
        ),
    ]