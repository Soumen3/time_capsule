// src/components/Notification.jsx
import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react'; // You might need to install @headlessui/react

/**
 * A reusable pop-up notification component.
 *
 * @param {object} props - Component props.
 * @param {string} props.message - The message to display in the notification.
 * @param {'success' | 'error' | 'info'} props.type - The type of notification (determines styling).
 * @param {boolean} props.isVisible - Controls the visibility of the notification.
 * @param {function} props.onClose - Callback function when the notification is closed.
 * @param {number} [props.duration=3000] - Duration in milliseconds before auto-closing. Set to 0 for no auto-close.
 */
const Notification = ({ message, type, isVisible, onClose, duration = 3000 }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose(); // Call onClose when auto-hiding
      }, duration);
      return () => clearTimeout(timer); // Cleanup timer on unmount or if visibility changes
    }
  }, [isVisible, duration, onClose]);

  // Determine background and text color based on type
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <Transition
      show={show}
      enter="transition ease-out duration-300 transform"
      enterFrom="opacity-0 translate-y-full"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-200 transform"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-full"
      className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
    >
      <div
        className={`p-4 rounded-lg shadow-lg flex items-center justify-between space-x-4 ${typeClasses[type]}`}
        role="alert"
      >
        <p className="flex-grow">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white opacity-75 hover:opacity-100 focus:outline-none"
          aria-label="Close notification"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </Transition>
  );
};

export default Notification;
