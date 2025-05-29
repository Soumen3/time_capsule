from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CapsuleSerializer 
from .models import Capsule, CapsuleContent # Ensure CapsuleContent is imported if not already
from rest_framework.permissions import IsAuthenticated
from .renderer import CapsuleRenderer
from rest_framework.parsers import MultiPartParser, FormParser # For file uploads


# Create your views here.
class CreateCapsuleView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [CapsuleRenderer]
    parser_classes = [MultiPartParser, FormParser] # Add parsers for FormData
    """
    View to create a new capsule.
    """
    def post(self, request, *args, **kwargs):
        # Pass context to the serializer, which includes the request object.
        # This allows the serializer to access request.user.
        serializer = CapsuleSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            # The owner is set within the serializer's create method using self.context['request'].user
            capsule = serializer.save() 
            # Re-serialize the created capsule instance to include related objects for the response
            response_serializer = CapsuleSerializer(capsule, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        # Print errors for debugging if validation fails
        print("Serializer Errors:", serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CapsuleListView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [CapsuleRenderer]

    def get(self, request, *args, **kwargs):
        # Retrieve all capsules owned by the currently authenticated user
        # and that are not archived.
        capsules = Capsule.objects.filter(owner=request.user, is_archived=False).order_by('-creation_date')
        
        # If you want to paginate, you would integrate Django REST Framework's pagination here.
        # For now, returning all non-archived capsules.
        
        serializer = CapsuleSerializer(capsules, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class CapsuleDetailView(APIView): # Example: A view to get details of a single capsule
    permission_classes = [IsAuthenticated]
    renderer_classes = [CapsuleRenderer]

    def get(self, request, pk, *args, **kwargs): # pk would be the capsule's ID
        try:
            capsule = Capsule.objects.get(pk=pk, owner=request.user) # Ensure owner can access
        except Capsule.DoesNotExist:
            return Response({"error": "Capsule not found or access denied."}, status=status.HTTP_404_NOT_FOUND)
        
        # The serializer will automatically include the 'contents'
        serializer = CapsuleSerializer(capsule, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

# In your urls.py, you would have a path like:
# path('capsules/<int:pk>/', CapsuleDetailView.as_view(), name='capsule-detail'),