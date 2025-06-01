import api from './api';

const notificationService = {
  getNotifications: async (params = {}) => { // params can include { is_read: true/false }
    try {
      const response = await api.get('capsules/notifications/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error.response || error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('capsules/notifications/unread-count/');
      return response.data; // Expected: { unread_count: X }
    } catch (error) {
      console.error('Error fetching unread notification count:', error.response || error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.post(`capsules/notifications/${notificationId}/mark-read/`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error.response || error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.post('capsules/notifications/mark-all-read/');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error.response || error);
      throw error;
    }
  },
};

export default notificationService;
