# Generated by Django 3.1.6 on 2021-12-19 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leaves', '0005_auto_20211217_0925'),
    ]

    operations = [
        migrations.AddField(
            model_name='leave',
            name='manager_rejected',
            field=models.BooleanField(default=False),
        ),
    ]
