from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

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

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
        
    def validate_password(self,value:str) ->str:
        """
        ハッシュ値に変換する
        """
        return make_password(value)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

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
