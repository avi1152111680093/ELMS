# Generated by Django 3.1.6 on 2021-12-20 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_types', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='leavetype',
            name='contract_based',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='leavetype',
            name='regular_based',
            field=models.BooleanField(null=True),
        ),
    ]