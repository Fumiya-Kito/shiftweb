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
def getAllShifts(request):
    query_section = request.query_params.get('section')
    query_period = request.query_params.get('period')
    if query_section == None:
        query_section = ''
    if query_period == None:
        query_period = ''

    shifts = Shift.objects.filter(section__icontains=query_section, period_start__icontains=query_period).order_by('user')
    serializer = ShiftSerializer(shifts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyShifts(request):
    user = request.user
    shifts = user.shift_set.order_by('-period_start')
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
        user_name=user.first_name,
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


@api_view(['PUT'])
# @permission_classes([IsAdminUser])
def updateIsConfirmed(request, pk):
    shift = Shift.objects.get(_id=pk)
    shift.is_confirmed = not shift.is_confirmed
    shift.save()
    return Response('Update isConfirmed')