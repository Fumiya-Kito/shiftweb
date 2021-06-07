from django.urls import path
from base import views


urlpatterns = [
    path('', views.getUsers, name="users"),
    path('profiles/', views.getProfiles, name="profiles"),
]