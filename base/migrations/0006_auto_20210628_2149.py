# Generated by Django 3.1.7 on 2021-06-28 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_profile_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='shift',
            name='is_confirmed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='shift',
            name='is_submitted',
            field=models.BooleanField(default=False),
        ),
    ]
