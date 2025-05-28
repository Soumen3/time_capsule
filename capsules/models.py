# capsules/models.py
from django.db import models
from django.conf import settings # To refer to the custom User model
from django.utils import timezone

# Assuming 'accounts.User' is your custom user model defined in settings.py
# If CapsuleRecipient also links to a User, ensure that app is installed
# and you import settings as well.

class Capsule(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_capsules',
        help_text="The user who created and owns this capsule."
    )
    title = models.CharField(max_length=255, help_text="A descriptive title for the capsule.")
    description = models.TextField(
        blank=True,
        help_text="Optional longer description for the capsule's purpose or contents."
    )
    creation_date = models.DateTimeField(
        auto_now_add=True,
        help_text="The exact date and time the capsule was created."
    )
    delivery_date = models.DateTimeField(
        help_text="The scheduled date and time for the capsule to be delivered."
    )
    is_delivered = models.BooleanField(
        default=False,
        help_text="Indicates if the capsule has been delivered."
    )
    is_archived = models.BooleanField(
        default=False,
        help_text="Indicates if the capsule is archived by the owner (e.g., after delivery)."
    )
    delivery_method = models.CharField(
        max_length=50,
        choices=[
            ('email', 'Email'),
            ('in_app', 'In-App Notification'),
            # ('sms', 'SMS'), # Potentially add later if needed
        ],
        default='email',
        help_text="The primary method for delivering the capsule content."
    )
    # Privacy settings
    privacy_status = models.CharField(
        max_length=50,
        choices=[
            ('private', 'Private (Only owner can access)'),
            ('shared', 'Shared (Specific recipients can access)'), # For group capsules
            # ('public', 'Public (Viewable by anyone, potentially)') # Consider carefully
        ],
        default='private',
        help_text="Determines who can access the capsule's contents."
    )
    # Fields for 'legacy management' / account inactivity
    transfer_on_inactivity = models.BooleanField(
        default=False,
        help_text="If true, capsule content may be transferred if owner account becomes inactive."
    )
    transfer_recipient_email = models.EmailField(
        blank=True, null=True,
        help_text="Email of the designated recipient for transfer on inactivity."
    )

    class Meta:
        verbose_name = "Time Capsule"
        verbose_name_plural = "Time Capsules"
        ordering = ['delivery_date'] # Default ordering for querying

    def __str__(self):
        return f"Capsule '{self.title}' by {self.owner.username}"

    # Custom methods can be added here, e.g., to check if capsule is due
    def is_due_for_delivery(self):
        return not self.is_delivered and self.delivery_date <= timezone.now()


class CapsuleContent(models.Model):
    capsule = models.ForeignKey(
        Capsule,
        on_delete=models.CASCADE,
        related_name='contents',
        help_text="The capsule this content belongs to."
    )
    content_type = models.CharField(
        max_length=50,
        choices=[
            ('text', 'Text'),
            ('image', 'Image'),
            ('video', 'Video'),
            ('audio', 'Audio'),
            ('document', 'Document'), # e.g., PDF, Word doc
        ],
        help_text="The type of content stored."
    )
    text_content = models.TextField(
        blank=True, null=True,
        help_text="Text content for 'text' type capsules."
    )
    file = models.FileField(
        upload_to='capsule_files/', # Will be handled by S3 via django-storages
        blank=True, null=True,
        help_text="File content for 'image', 'video', 'audio', 'document' types."
    )
    thumbnail = models.ImageField(
        upload_to='capsule_thumbnails/',
        blank=True, null=True,
        help_text="Thumbnail for media files (e.g., video previews)."
    )
    upload_date = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when this content was uploaded."
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of content within a capsule (for display purposes)."
    )

    class Meta:
        verbose_name = "Capsule Content"
        verbose_name_plural = "Capsule Contents"
        ordering = ['order']

    def __str__(self):
        return f"Content for Capsule '{self.capsule.title}' ({self.content_type})"


class CapsuleRecipient(models.Model):
    capsule = models.ForeignKey(
        Capsule,
        on_delete=models.CASCADE,
        related_name='recipients',
        help_text="The capsule this recipient is associated with."
    )
    recipient_email = models.EmailField(
        help_text="The email address of the person who will receive the capsule."
    )
    # recipient_user = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.SET_NULL,
    #     related_name='received_capsules',
    #     blank=True, null=True,
    #     help_text="Optional: If the recipient is also a registered user."
    # )
    received_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending Delivery'),
            ('sent', 'Sent'),
            ('failed', 'Failed'),
            ('opened', 'Opened'), # If you implement tracking
        ],
        default='pending',
        help_text="Status of the capsule delivery to this specific recipient."
    )
    sent_date = models.DateTimeField(
        blank=True, null=True,
        help_text="The date and time the capsule was sent to this recipient."
    )

    class Meta:
        verbose_name = "Capsule Recipient"
        verbose_name_plural = "Capsule Recipients"
        unique_together = ('capsule', 'recipient_email')

    def __str__(self):
        return f"Recipient {self.recipient_email} for Capsule '{self.capsule.title}'"


class DeliveryLog(models.Model):
    capsule = models.ForeignKey(
        Capsule,
        on_delete=models.CASCADE,
        related_name='delivery_logs',
        help_text="The capsule that was attempted to be delivered."
    )
    delivery_attempt_time = models.DateTimeField(
        auto_now_add=True,
        help_text="The date and time of this delivery attempt."
    )
    delivery_method = models.CharField(
        max_length=50,
        choices=[
            ('email', 'Email'),
            ('in_app', 'In-App Notification'),
            ('sms', 'SMS'),
        ],
        help_text="The method used for this specific delivery attempt."
    )
    recipient_email = models.EmailField(
        blank=True, null=True,
        help_text="The email of the recipient (if applicable to the method)."
    )
    recipient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True, null=True,
        help_text="The user ID of the recipient (if applicable to the method)."
    )
    status = models.CharField(
        max_length=50,
        choices=[
            ('success', 'Success'),
            ('failure', 'Failure'),
            ('pending', 'Pending (e.g., for async email service)'),
        ],
        default='pending',
        help_text="The outcome of the delivery attempt."
    )
    error_message = models.TextField(
        blank=True, null=True,
        help_text="Detailed error message if the delivery failed."
    )
    external_id = models.CharField(
        max_length=255, blank=True, null=True,
        help_text="External ID from the delivery service (e.g., SendGrid message ID)."
    )

    class Meta:
        verbose_name = "Delivery Log"
        verbose_name_plural = "Delivery Logs"
        ordering = ['-delivery_attempt_time']

    def __str__(self):
        return (
            f"Delivery Log for Capsule '{self.capsule.title}' "
            f"to {self.recipient_email or self.recipient_user} - {self.status}"
        )


class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The user who receives this notification."
    )
    capsule = models.ForeignKey(
        Capsule,
        on_delete=models.SET_NULL,
        blank=True, null=True,
        related_name='notifications',
        help_text="The capsule related to this notification (optional)."
    )
    message = models.TextField(
        help_text="The content of the notification."
    )
    notification_type = models.CharField(
        max_length=50,
        choices=[
            ('delivery_success', 'Capsule Delivered'),
            ('delivery_fail', 'Capsule Delivery Failed'),
            ('new_shared_capsule', 'New Shared Capsule'),
            ('reminder', 'Reminder'),
            ('system_alert', 'System Alert'),
            ('transfer_notification', 'Capsule Transferred'),
        ],
        help_text="Categorizes the type of notification."
    )
    is_read = models.BooleanField(
        default=False,
        help_text="Indicates if the user has viewed this notification."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="The date and time the notification was created."
    )
    read_at = models.DateTimeField(
        blank=True, null=True,
        help_text="The date and time the notification was read."
    )

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.notification_type}"