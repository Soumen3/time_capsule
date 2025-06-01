// src/components/Layout/MainLayout.jsx
import React from 'react';
import Navbar from './Navbar'; // Make sure Navbar is imported
import Footer from './Footer'; // If you have a Footer component

/**
 * MainLayout component provides a consistent layout for authenticated pages.
 * It includes the Navbar at the top, a main content area for children,
 * and a Footer at the bottom.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the main layout area.
 */
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /> {/* Ensure Navbar is rendered */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      {/* You might want a global notification toast container here if not already handled by NotificationProvider */}
    </div>
  );
};

export default MainLayout;
