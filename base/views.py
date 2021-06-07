from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserSerializer, ProfileSerializer

# Create your views here.

@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProfiles(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getShifts(request):
    shift = Shift.objects.all()
    serializer = Shifterializer(shift, many=True)
    return Response(serializer.data)