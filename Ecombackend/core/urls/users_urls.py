from django.urls import path
from core.views.user_views import *

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', registerUser, name='register'),

    # path('create/', createUser, name='user-create'),

    path('profile/', getUserProfile, name="users-profile"),
    path('profile/update/', updateUserProfile, name="user-profile-update"),
    # path('password/update/', updateUserPassword, name="user-password-update"),
    path('', getUsers, name="users"),

    path('<str:pk>/', getUserById, name="user"),

    path('update/<str:pk>/', updateUser, name="user-update"),

    path('delete/<str:pk>/', deleteUser, name="user-delete"),
]
