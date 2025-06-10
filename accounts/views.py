from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import( 
    UserSerializer, 
    UserLoginSerializer, 
    UserRegistrationSerializer, 
    UserProfileSerializer, 
    ChangePasswordSerializer,
    PasswordResetRequestSerializer, 
    OTPVerifySerializer,            
    PasswordResetSetNewSerializer   
                         )
from .models import User
from .renderer import UserRenderer # Assuming you have this custom renderer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from rest_framework_simplejwt.tokens import RefreshToken, TokenError # Assuming you use SimpleJWT
import logging

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }



# Create your views here.
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, email=email, password=password)
        if user:
            # Get or create the DRF token and return only the key (string), not the Token object
            token, _ = Token.objects.get_or_create(user=user)
            tokens = get_tokens_for_user(user)
            return Response({
                'token': token.key,
                'tokens': tokens,
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request):
        """
        Logs out the authenticated user by deleting their auth token.
        """
        # If you see "no such table: authtoken_token", you need to run migrations for rest_framework.authtoken.
        # Run: python manage.py migrate authtoken
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({'message': 'Successfully logged out.', 'status':200}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({'error': 'No active session found for this user.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'User registered successfully.',
            'user': UserSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        # Pass partial=True to allow partial updates (e.g., only updating 'bio')
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            # Update the session auth hash to prevent the user from being logged out
            update_session_auth_hash(request, user)
            logger.info(f"User {request.user.email} successfully changed their password.")
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        logger.warning(f"User {request.user.email} failed to change password. Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]


    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save() 
            logger.info(f"Password reset OTP sent to {data.get('email')}.")
            return Response(
                {"detail": "An OTP has been sent to your email address.", "email": data.get('email')},
                status=status.HTTP_200_OK
            )
        logger.warning(f"Password reset request failed for {request.data.get('email')}. Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]

    def post(self, request, *args, **kwargs):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            logger.info(f"OTP verified successfully for email: {request.data.get('email')}")
            return Response({"detail": "OTP verified successfully. You can now set a new password.", "email": request.data.get('email')}, status=status.HTTP_200_OK)
        logger.warning(f"OTP verification failed for email: {request.data.get('email')}. Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetSetNewView(APIView):
    permission_classes = [AllowAny] 
    renderer_classes = [UserRenderer]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSetNewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Password successfully reset for email: {request.data.get('email')}")
            return Response({"detail": "Password has been reset successfully. You can now log in."}, status=status.HTTP_200_OK)
        logger.warning(f"Setting new password failed for email: {request.data.get('email')}. Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)