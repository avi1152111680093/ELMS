# Generated by Django 3.1.6 on 2021-11-17 17:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leave_type_name', models.TextField(max_length=50)),
                ('leave_type_code', models.TextField(max_length=10)),
                ('created_on', models.DateField(auto_now_add=True)),
            ],
        ),
    ]
