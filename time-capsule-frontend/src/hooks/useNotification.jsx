// src/hooks/useNotification.jsx
import React, { useState, useCallback, createContext, useContext } from 'react';
import Notification from '../components/Notification'; // Adjust path if needed

// Create a Context for the notification state and functions
const NotificationContext = createContext();

/**
 * NotificationProvider component.
 * Wraps the application or a part of it to provide notification context.
 * Renders the Notification component globally.
 */
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'info', // 'success', 'error', 'info'
    isVisible: false,
    duration: 3000,
  });

  /**
   * Shows a notification.
   * @param {string} message - The message to display.
   * @param {'success' | 'error' | 'info'} type - The type of notification.
   * @param {number} [duration=3000] - How long the notification stays visible (0 for indefinite).
   */
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type, isVisible: true, duration });
  }, []);

  /**
   * Hides the current notification.
   */
  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to consume the notification context.
 * Provides `showNotification` and `hideNotification` functions.
 * @returns {{showNotification: function, hideNotification: function}}
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
