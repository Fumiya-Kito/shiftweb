from django.urls import path
from base.views import user_views as views


urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('admin/getusers/', views.getUsers, name="users"),
    path('getuser/', views.getUser, name="user"),
    path('profiles/', views.getProfiles, name="profiles"),
    path('profile/', views.getProfile, name="profile"),
    path('update/profile/', views.updateProfile, name="update-profile"),
    path('admin/updateuser/<str:pk>/', views.updateUser, name="update-user"),
    path('admin/deleteuser/<str:pk>/', views.deleteUser, name="delete-user"),
	path('<str:pk>/', views.getUserById, name="user"), 
]