import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../../services/notification';
import Button from '../Button'; // Assuming Button component exists

const NotificationDropdown = ({ onClose, onNotificationsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch both read and unread, sort by date, limit display
      const data = await notificationService.getNotifications(); 
      setNotifications(data.slice(0, 10)); // Show latest 10
    } catch (err) {
      setError('Failed to load notifications.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      onNotificationsRead(); // Notify parent to update unread count
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      onNotificationsRead(); // Notify parent to update unread count
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
        case 'delivery_success': return '🎉'; // Capsule Delivered
        case 'delivery_fail': return '⚠️'; // Capsule Delivery Failed
        case 'new_shared_capsule': return '📬'; // New Shared Capsule
        case 'reminder': return '🔔'; // Reminder
        case 'system_alert': return '📢'; // System Alert
        case 'transfer_notification': return '🔄'; // Capsule Transferred
        default: return 'ℹ️';
    }
  }

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-xl z-50 border border-gray-200">
      <div className="p-3 flex justify-between items-center border-b">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <Button onClick={handleMarkAllAsRead} variant="link" className="text-sm text-indigo-600 hover:text-indigo-800 p-0">
          Mark all as read
        </Button>
      </div>
      {isLoading && <div className="p-4 text-center text-gray-500">Loading...</div>}
      {error && <div className="p-4 text-center text-red-500">{error}</div>}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="p-4 text-center text-gray-500">No new notifications.</div>
      )}
      {!isLoading && !error && notifications.length > 0 && (
        <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {notifications.map(notification => (
            <li key={notification.id} className={`p-3 hover:bg-gray-50 ${notification.is_read ? 'opacity-70' : ''}`}>
              <div className="flex items-start space-x-3">
                <span className="text-xl mt-0.5">{getNotificationIcon(notification.notification_type)}</span>
                <div className="flex-1">
                  <p className={`text-sm text-gray-700 ${!notification.is_read ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.created_at_formatted}
                    {notification.capsule_title && (
                        <span className="ml-1 text-indigo-500"> (Capsule: {notification.capsule_title})</span>
                    )}
                  </p>
                </div>
                {!notification.is_read && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)} 
                    title="Mark as read"
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="p-2 border-t text-center">
        <Link to="/notifications" onClick={onClose} className="text-sm text-indigo-600 hover:underline">
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
