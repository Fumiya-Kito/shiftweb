from django.urls import path
from base.views import shift_views as views


urlpatterns = [
    # path('myshift/<str:pk>/', views.getMyShift, name="my-shift"),
    path('admin/shifts/', views.getAllShifts, name="admin-shifts"),
    path('myshifts/', views.getMyShifts, name="my-shifts"),
    path('confirm/<str:pk>/', views.getShiftById, name="shift-comfirm"),
    path('shiftItem/create/', views.createShiftItem, name="shiftItem-create"),
    path('shift/create/', views.addShiftItems, name="shift-create"),
]