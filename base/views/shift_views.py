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
# @permission_classes([IsAdminUser])
# def getAllShifts(request):
#     shifts = Shift.objects.all()
#     serializer = ShiftSerializer(shifts, many=True)
#     return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllShifts(request):
    shifts = Shift.objects.order_by('section', 'period_start', 'user')
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
            Response({'detail': 'Not authorized to view this shift'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Shift does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getShiftItemById(request, pk):
    user = request.user

    try:
        shiftItem = ShiftItem.objects.get(_id=pk)
        if user.is_staff or shift.user == user:
            serializer = ShiftItemSerializer(shiftItem, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this shiftItem'},
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



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateShiftItem(request, pk):
    data= request.data
    shiftItem = ShiftItem.objects.get(_id=pk)

    if shiftItem.is_work != data['isWork']:
        shiftItem.delete()
    else:
        shiftItem.is_all_day = data['isAllDay']
        shiftItem.start_time = data['startTime']
        shiftItem.end_time = data['endTime']
        shiftItem.save()

    return Response('updated!')



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateShiftItems(request, pk):
    data = request.data
    shift = Shift.objects.get(_id=pk)
    
    shiftItems = shift.shiftitem_set.all()
    requestedShiftItems = data['shiftItems']

    for before in shiftItems:
        isUpdated = False
        for after in requestedShiftItems[:]:
            if before.date == after['date']:
                #update
                before.is_all_day = after['isAllDay'] 
                before.start_time = after['StartTime'] 
                before.end_time = after['EndTime']
                isUpdated = True
                requestedShiftItems.remove(after)
                break
        if not isUpdated:
            #delete
            before.delete()

    for remain in requestedShiftItems:
        #create
        ShiftItem.objects.create(
            shift=shift,
            date=remain['date'],
            is_work=remain['isWork'],
            is_all_day=remain['isAllDay'],
            start_time=remain['startTime'],
            end_time=remain['endTime'],
        )

    shift.remarks=data['remarks']
    shift.save()

    return Response('Update shiftItems')


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getMyShift(request, pk):
#     user = request.user
#     shift = user.shift_set.get(_id=pk)
#     shiftItems = shift.shiftitem_set.all()
#     serializer = ShiftItemSerializer(shiftItems, many=True)
#     return Response(serializer.data)