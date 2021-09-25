import datetime
from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    section = models.CharField(max_length=50, null=True, blank=True)
    duty = models.CharField(max_length=50, null=True, blank=True)
    employment_status = models.CharField(max_length=50, null=True, blank=True)
    is_rookie = models.BooleanField(default=True)
    is_open_staff = models.BooleanField(default=False)
    is_pre_close_staff = models.BooleanField(default=False)
    is_close_staff = models.BooleanField(default=False)
    start_default = models.TimeField(default=datetime.time(8,0))
    end_default = models.TimeField(default=datetime.time(17,0))
    desired_times_per_week = models.IntegerField(null=True, blank=True, default=0)
    desired_working_time = models.IntegerField(null=True, blank=True, default=0)
    commute = models.CharField(max_length=50, null=True, blank=True)
    station = models.CharField(max_length=50, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.user)

class Shift(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    user_name = models.CharField(max_length=50, null=True, blank=True)
    section = models.CharField(max_length=50, null=True, blank=True)
    period_start = models.DateField(auto_now_add=False)
    period_end = models.DateField(auto_now_add=False)
    remarks = models.TextField(null=True, blank=True)
    # is_submitted = models.BooleanField(default=False)
    is_confirmed = models.BooleanField(default=False)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self._id) + ': ' + str(self.user.first_name) + '/ ' + str(self.period_start) + '~' + str(self.period_end)


class ShiftItem(models.Model):
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField(auto_now_add=False)
    day = models.CharField(max_length=50, null=True, blank=True)
    is_work = models.BooleanField(default=False)
    is_all_day = models.BooleanField(default=False)
    start_time = models.TimeField(auto_now=False, blank=True, default=datetime.time(8,0))
    end_time = models.TimeField(auto_now=False, blank=True, default=datetime.time(3,00))
    _id = models.AutoField(primary_key=True, editable=False)
    
    def __str__(self):
        return str(self._id) + ': ' + str(self.shift.user.first_name) + ': ' + str(self.date)