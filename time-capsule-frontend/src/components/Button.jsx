// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  const baseStyles = 'font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ease-in-out shadow-md';
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-white focus:ring-pink-400',
    secondary: 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white focus:ring-purple-400',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white focus:ring-red-400',
    outline: 'border-2 border-pink-500 text-pink-600 hover:bg-pink-50 focus:ring-pink-400 bg-transparent',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;