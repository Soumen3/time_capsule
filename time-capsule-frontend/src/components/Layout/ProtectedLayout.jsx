import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import authService from '../../services/auth';
import LoadingSpinner from '../LoadingSpinner';
const ProtectedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (isMounted) {
        if (!currentUser) {
          navigate('/login', { state: { from: location }, replace: true });
        } else {
          setIsAuthenticated(true);
        }
        setIsAuthChecked(true);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [navigate, location]);

  if (!isAuthChecked) {
    // Optional: Display a global loading spinner for the entire page
    return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 bg-gray-100">
            <LoadingSpinner size="h-16 w-16" />
        </div>
    );
  }

  if (!isAuthenticated) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback, prevent rendering Outlet.
    return null; 
  }

  return (
    <MainLayout>
      <Outlet /> {/* Child routes (DashboardPage, CapsuleCreatorPage, etc.) will render here */}
    </MainLayout>
  );
};

export default ProtectedLayout;
