// src/components/Layout/MainLayout.jsx
import React from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import Footer from './Footer'; // Adjust path if needed

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
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter">
      {/* The Navbar will appear at the top of all pages using this layout */}
      <Navbar />
      {/* The main content area, where specific page components will be rendered */}
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center">
        {children}
      </main>
      {/* The Footer will appear at the bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;
