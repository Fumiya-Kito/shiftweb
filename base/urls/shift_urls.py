from django.urls import path
from base.views import shift_views as views


urlpatterns = [
    # path('myshift/<str:pk>/', views.getMyShift, name="my-shift"),
    path('admin/shifts/', views.getAllShifts, name="admin-shifts"),
    path('myshifts/', views.getMyShifts, name="my-shifts"),
    path('confirm/<str:pk>/', views.getShiftById, name="shift-comfirm"),
    path('shiftItem/confirm/<str:pk>/', views.getShiftItemById, name="shiftItem-comfirm"),
    path('shiftitem-update/<str:pk>/', views.updateShiftItem, name="shiftitem-update"),
    path('shift-update/<str:pk>/', views.updateShiftItems, name="shift-update"),
    path('shift/create/', views.addShiftItems, name="shift-create"),
    # path('shift/update/<str:pk>/', views.updateShiftItems, name="shift-update"),
]