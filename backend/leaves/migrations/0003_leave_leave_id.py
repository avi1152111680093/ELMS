# Generated by Django 3.1.6 on 2021-12-14 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leaves', '0002_auto_20211214_2044'),
    ]

    operations = [
        migrations.AddField(
            model_name='leave',
            name='leave_id',
            field=models.TextField(default=True, max_length=50),
        ),
    ]