from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile, ShiftItem

import datetime

@receiver(post_save, sender=User)
def createProfile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user=instance,
            name=instance.first_name
        )

#login ID -> email
@receiver(pre_save, sender=User)
def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

@receiver(pre_save, sender=ShiftItem)
def setDay(sender, instance, **kwargs):
    shiftItem = instance
    # change to date from str
    if type(shiftItem.date) is str:
        tdatetime = datetime.datetime.strptime(shiftItem.date, '%Y-%m-%d')
        shiftItem.date = datetime.date(tdatetime.year, tdatetime.month, tdatetime.day)

    if shiftItem.is_work:
        shiftItem.day = shiftItem.date.strftime('%a')
