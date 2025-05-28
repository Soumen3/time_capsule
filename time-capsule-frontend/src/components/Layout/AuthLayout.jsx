// src/components/Layout/AuthLayout.jsx
import React from 'react';

/**
 * AuthLayout component provides a consistent layout for authentication pages
 * like Login and Register. It centers its children vertically and horizontally
 * and applies a common background.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the layout.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      {/* The children (e.g., LoginPage or RegisterPage content) will be rendered here */}
      {children}
    </div>
  );
};

export default AuthLayout;
