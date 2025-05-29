from rest_framework import serializers
from .models import Capsule, CapsuleContent, CapsuleRecipient, CapsuleContentType
from django.utils import timezone

class CapsuleRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapsuleRecipient
        fields = ['recipient_email'] # Add other fields if needed for response

class CapsuleContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapsuleContent
        fields = ['id', 'content_type', 'text_content', 'file', 'upload_date', 'order']


class CapsuleSerializer(serializers.ModelSerializer):
    # Fields from the frontend that are not directly on the Capsule model
    # but are used to create related objects.
    # We use write_only=True as these fields are for input only during creation.
    text_content = serializers.CharField(write_only=True, required=False, allow_blank=True)
    media_files = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    recipient_email = serializers.EmailField(write_only=True, required=True) # Assuming one recipient for now

    # To include related objects in the response (read-only)
    contents = CapsuleContentSerializer(many=True, read_only=True)
    recipients = CapsuleRecipientSerializer(many=True, read_only=True) # For showing recipient in response

    class Meta:
        model = Capsule
        fields = [
            'id', 'owner', 'title', 'description',
            'delivery_date', 'delivery_time',
            'creation_date', 'is_delivered', 'is_archived',
            'delivery_method', 'privacy_status',
            # Write-only fields for creation
            'text_content', 'media_files', 'recipient_email',
            # Read-only fields for response
            'contents', 'recipients'
        ]
        read_only_fields = ['owner', 'id', 'creation_date', 'is_delivered', 'is_archived']

    def get_file_content_type(self, file):
        # Basic content type detection based on file extension
        # You might want a more robust solution (e.g., using python-magic)
        name = file.name.lower()
        if name.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            return CapsuleContentType.IMAGE
        elif name.endswith(('.mp4', '.avi', '.mov', '.webm')):
            return CapsuleContentType.VIDEO
        elif name.endswith(('.mp3', '.wav', '.ogg')):
            return CapsuleContentType.AUDIO
        elif name.endswith(('.pdf', '.doc', '.docx', '.txt', '.rtf')):
            return CapsuleContentType.DOCUMENT
        return CapsuleContentType.DOCUMENT # Default or raise error

    def create(self, validated_data):
        owner = self.context['request'].user
        
        media_files_data = validated_data.pop('media_files', [])
        text_content_data = validated_data.pop('text_content', None)
        recipient_email_data = validated_data.pop('recipient_email')

        # Create the capsule instance
        capsule = Capsule.objects.create(owner=owner, **validated_data)

        # Create CapsuleContent for the text message if provided
        if text_content_data:
            CapsuleContent.objects.create(
                capsule=capsule,
                content_type=CapsuleContentType.TEXT,
                text_content=text_content_data,
                order=0 # Assuming text content is first
            )

        # Create CapsuleContent for each uploaded media file
        # Start order after text content if it exists
        file_order_start = 1 if text_content_data else 0
        for index, file_data in enumerate(media_files_data):
            content_type = self.get_file_content_type(file_data)
            CapsuleContent.objects.create(
                capsule=capsule,
                content_type=content_type,
                file=file_data,
                order=file_order_start + index
            )
        
        # Create CapsuleRecipient
        # For multiple recipients, recipient_email_data would be a list
        CapsuleRecipient.objects.create(
            capsule=capsule,
            recipient_email=recipient_email_data,
            # received_status will default to PENDING
        )

        return capsule
