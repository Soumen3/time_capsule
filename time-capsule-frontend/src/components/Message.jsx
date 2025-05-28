import React, { useEffect } from 'react';

const Message = ({ type = 'info', children, onClose }) => {
  // type: 'info', 'success', 'error', 'warning'
  const baseStyle = 'px-4 py-3 rounded relative mb-4 text-sm font-medium';
  const typeStyles = {
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  };

  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
      {children}
      {onClose && (
        <button
          className="absolute top-1 right-2 text-xl font-bold text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Message;
