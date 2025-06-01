import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../../services/notification';
import NotificationDropdown from './NotificationDropdown'; // We'll create this next

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      setIsLoadingCount(true);
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("Failed to fetch unread notification count", error);
      // setUnreadCount(0); // Or handle error display
    } finally {
      setIsLoadingCount(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Optional: Poll for new notifications periodically
    const interval = setInterval(fetchUnreadCount, 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleIconClick = () => {
    setShowDropdown(prev => !prev);
    if (!showDropdown && unreadCount > 0) {
        // Optionally, if opening the dropdown should immediately fetch fresh notifications
        // or if marking them as "seen" (but not "read") is a feature.
        // For now, opening just shows existing ones.
    }
  };
  
  const onNotificationsRead = () => {
    fetchUnreadCount(); // Re-fetch count after notifications are read
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleIconClick}
        className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {isLoadingCount ? (
            <span className="absolute top-0 right-0 block h-3 w-3 transform -translate-y-1/2 translate-x-1/2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
            </span>
        ) : unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {showDropdown && (
        <NotificationDropdown 
            onClose={() => setShowDropdown(false)} 
            onNotificationsRead={onNotificationsRead}
        />
      )}
    </div>
  );
};

export default NotificationIcon;
