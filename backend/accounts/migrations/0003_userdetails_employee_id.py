# Generated by Django 3.1.6 on 2021-12-07 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20211207_0722'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='employee_id',
            field=models.TextField(default='', max_length=50),
        ),
    ]
