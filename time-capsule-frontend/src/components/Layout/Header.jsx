// src/components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth'; // Adjust path if needed
import Button from '../Button'; // Adjust path if needed

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs on component mount and if user state changes
    // It's a simplified way to check auth status for the header.
    // In a larger app, you'd use a global auth context/hook.
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []); // Empty dependency array means it runs once on mount

  const handleLogout = () => {
    authService.logout();
    setUser(null); // Clear user state
    navigate('/login'); // Redirect to login
  };

  return (
    <header className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center w-full max-w-7xl mx-auto mt-4">
      <Link to="/" className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-700 transition duration-200">
        Time Capsule
      </Link>
      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700 font-medium hidden md:block">Welcome, {user.email}!</span>
            <Link to="/dashboard">
              <Button variant="outline" className="text-sm px-3 py-1.5 md:px-4 md:py-2">Dashboard</Button>
            </Link>
            <Link to="/create-capsule">
              <Button variant="primary" className="text-sm px-3 py-1.5 md:px-4 md:py-2">Create Capsule</Button>
            </Link>
            <Button onClick={handleLogout} variant="secondary" className="text-sm px-3 py-1.5 md:px-4 md:py-2">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" className="text-sm px-3 py-1.5 md:px-4 md:py-2">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" className="text-sm px-3 py-1.5 md:px-4 md:py-2">Register</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;