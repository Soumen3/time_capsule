from django.urls import path
from .views import CreateCapsuleView, CapsuleDetailView, CapsuleListView  # Import the CapsuleDetailView if needed later

# Define URL patterns for the capsules app
urlpatterns = [
    path('create/', CreateCapsuleView.as_view(), name='create_capsule'),
    path('<int:pk>/', CapsuleDetailView.as_view(), name='capsule_detail'),  # Example detail view for a capsule
    path('', CapsuleListView.as_view(), name='capsule_list'),  # List all capsules for the authenticated user
]
