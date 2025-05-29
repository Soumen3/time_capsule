from django.core.mail import send_mail
from django.conf import settings
import logging # Import logging

logger = logging.getLogger(__name__) # Get a logger instance

def send_capsule_link_email(recipient_email, capsule_title, capsule_id, owner_name):
    """
    Sends an email to the recipient with a link to view the capsule.
    Returns: (bool, str_or_None) -> (success_status, message_or_error_string)
    """
    # Construct the frontend URL. This is an example and might need adjustment
    # based on your frontend routing and domain.
    # For local development, it might be like: http://localhost:5173/capsule/1
    frontend_base_url = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:5173') # Add FRONTEND_BASE_URL to settings
    capsule_link = f"{frontend_base_url}/capsule/{capsule_id}/"

    subject = f"A Time Capsule from {owner_name} is ready for you!"
    message_body = f"""
    Hello,

    A time capsule titled "{capsule_title}" created by {owner_name} has been unsealed and is now available for you to view.

    You can view the capsule here:
    {capsule_link}

    Enjoy your journey to the past!

    Sincerely,
    The Time Capsule Team
    """
    from_email = settings.EMAIL_HOST_USER


    try:
        send_mail(
            subject,
            message_body,
            from_email,
            [recipient_email],
            fail_silently=False,
        )
        logger.info(f"Capsule link email successfully sent to {recipient_email} for capsule ID {capsule_id}")
        return True, "Email sent successfully."
    except Exception as e:
        error_message = f"Error sending email for capsule ID {capsule_id} to {recipient_email} from {from_email}: {e}"
        logger.error(error_message)
        return False, error_message

