from django.shortcuts import render

from django.contrib.auth.models import User
from base.models import Profile, Shift, ShiftItem
from base.serializers import UserSerializer, UserSerializerWithToken, ProfileSerializer, ShiftItemSerializer, ShiftSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status


#views
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getMyShift(request, pk):
#     user = request.user
#     shift = user.shift_set.get(_id=pk)
#     shiftItems = shift.shiftitem_set.all()
#     serializer = ShiftItemSerializer(shiftItems, many=True)
#     return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllShifts(request):
    shifts = Shift.objects.all()
    serializer = ShiftSerializer(shifts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyShifts(request):
    user = request.user
    shifts = user.shift_set.all()
    serializer = ShiftSerializer(shifts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getShiftById(request, pk):
    user = request.user

    try:
        shift = Shift.objects.get(_id=pk)
        if user.is_staff or shift.user == user:
            serializer = ShiftSerializer(shift, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Shift does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addShiftItems(request):
    user = request.user
    data = request.data

    #front で配列をつくる
    shiftItems = data['shiftItems']

    #1. create shift model
    shift = Shift.objects.create(
        user=user,
        section=data['section'],
        period_start=data['periodStart'],
        period_end=data['periodEnd'],
        remarks=data['remarks'],
        is_submitted=data['isSubmitted']
    )
    #2. create shiftItems
    for i in shiftItems:
        item = ShiftItem.objects.create(
            shift=shift,
            date=i['date'],
            is_work=i['isWork'],
            is_all_day=i['isAllDay'],
            start_time=i['startTime'],
            end_time=i['endTime'],
        )

    serializer= ShiftSerializer(shift, many=False)
    return Response(serializer.data)

# check用
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createShiftItem(request):
    user = request.user
    data = request.data

    # create shiftItems
    item = ShiftItem.objects.create(
        #仮置 (hardCode)
        shift=Shift.objects.get(_id=2),
        date=data['date'],
        is_work=data['isWork'],
        is_all_day=data['isAllDay'],
        start_time=data['startTime'],
        end_time=data['endTime']
    )

    return Response('shiftItem created!')

