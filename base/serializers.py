from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj): #objはUserモデルのオブジェクト, fieldはdocumentation参照
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    str_is_rookie = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'name', 'section', 'duty', 'employment_status', 'is_rookie', 'str_is_rookie',
            'is_open_staff', 'is_pre_close_staff', 'is_close_staff',
            'start_default', 'end_default', 'desired_times_per_week',
            'desired_working_time', 'commute', 'station', '_id'
        ]

    def get_name(self, obj):
        return obj.user.username

    def get_str_is_rookie(self, obj):
        if obj.is_rookie:
            return '○'
        return '☓'

class ShiftItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftItem
        fields = '__all__'

class ShiftSerializer(serializers.ModelSerializer):
    shiftItems = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Shift
        fields = '__all__'

    def get_shiftItems(self, obj):
        items = obj.shiftitem_set.all()
        serializer = ShiftItemSerializer(items, many=True)
        return serializer.data
