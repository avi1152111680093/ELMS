# Generated by Django 3.1.6 on 2021-12-09 07:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_userdetails_employee_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='flat',
            field=models.TextField(default='', max_length=50),
        ),
        migrations.AddField(
            model_name='userdetails',
            name='state',
            field=models.TextField(default='', max_length=50),
        ),
        migrations.AddField(
            model_name='userdetails',
            name='town',
            field=models.TextField(default='', max_length=50),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='online',
            field=models.BooleanField(default=False, null=True),
        ),
    ]