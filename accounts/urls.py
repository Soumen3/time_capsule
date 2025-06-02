from django.urls import path
from .views import UserLoginView, UserLogoutView, UserRegistrationView, CurrentUserView, UserProfileView

app_name = 'accounts'

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('logout/', UserLogoutView.as_view(), name='user_logout'),
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('profile/', UserProfileView.as_view(), name='user-profile'), 
    path('profile/update/', UserProfileView.as_view(), name='user-profile-detail'),
]