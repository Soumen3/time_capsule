from django.urls import path
from .views import UserLoginView, UserLogoutView, UserRegistrationView, CurrentUserView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('logout/', UserLogoutView.as_view(), name='user_logout'),
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
]