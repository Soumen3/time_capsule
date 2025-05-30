from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateCapsuleView, CapsuleDetailView, CapsuleListView, CapsuleViewSet, PublicCapsuleRetrieveView

# Define URL patterns for the capsules app
router = DefaultRouter()
router.register(r'capsules', CapsuleViewSet, basename='capsule')

urlpatterns = [
    path('create/', CreateCapsuleView.as_view(), name='create_capsule'),
    path('<int:pk>/', CapsuleDetailView.as_view(), name='capsule_detail'),  # Example detail view for a capsule
    path('', CapsuleListView.as_view(), name='capsule_list'),  # List all capsules for the authenticated user
    path('', include(router.urls)),
    path('public/capsules/<uuid:access_token>/', PublicCapsuleRetrieveView.as_view(), name='public-capsule-detail'),
]
