import React, { useState, useEffect } from 'react';
import notificationService from '../services/notification';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      let params = {};
      if (filter === 'unread') params.is_read = false;
      if (filter === 'read') params.is_read = true;
      const data = await notificationService.getNotifications(params);
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Optimistically update or refetch
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      // If you have a global unread count, update it here or via a shared state/context
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch(type) {
        case 'delivery_success': return '🎉';
        case 'delivery_fail': return '⚠️';
        case 'new_shared_capsule': return '📬';
        case 'reminder': return '🔔';
        case 'system_alert': return '📢';
        case 'transfer_notification': return '🔄';
        default: return 'ℹ️';
    }
  }


  return (
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>
        
        <div className="mb-4 flex space-x-2">
            <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'primary' : 'outline'} size="sm">All</Button>
            <Button onClick={() => setFilter('unread')} variant={filter === 'unread' ? 'primary' : 'outline'} size="sm">Unread</Button>
            <Button onClick={() => setFilter('read')} variant={filter === 'read' ? 'primary' : 'outline'} size="sm">Read</Button>
        </div>

        {isLoading && <div className="p-4 text-center text-gray-500">Loading notifications...</div>}
        {error && <div className="p-4 text-center text-red-500 bg-red-50 border border-red-200 rounded">{error}</div>}
        
        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500 bg-gray-50 border rounded">
            You have no {filter !== 'all' ? filter : ''} notifications.
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <ul className="space-y-4">
            {notifications.map(notification => (
              <li key={notification.id} className={`p-4 border rounded-lg shadow-sm flex items-start space-x-3 ${notification.is_read ? 'bg-gray-50 opacity-80' : 'bg-white'}`}>
                <span className="text-2xl mt-1">{getNotificationIcon(notification.notification_type)}</span>
                <div className="flex-1">
                  <p className={`text-gray-800 ${!notification.is_read ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.created_at_formatted}
                    {notification.capsule_title && (
                        <Link to={`/capsule/${notification.capsule}`} className="ml-1 text-indigo-600 hover:underline">
                             (Capsule: {notification.capsule_title})
                        </Link>
                    )}
                  </p>
                </div>
                {!notification.is_read && (
                  <Button onClick={() => handleMarkAsRead(notification.id)} variant="secondary" size="sm" className="ml-auto">
                    Mark as read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
  );
};

export default NotificationPage;
