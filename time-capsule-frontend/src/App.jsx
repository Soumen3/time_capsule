// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import authService from './services/auth'; 

// Import Layout Components
// import MainLayout from './components/Layout/MainLayout'; // No longer directly needed here if pages don't import it
import ProtectedLayout from './components/Layout/ProtectedLayout'; // Import the new layout component

// Import Page Components
import LoginPage from './pages/Auth/LoginPage'; 
import RegisterPage from './pages/Auth/RegisterPage'; 
import DashboardPage from './pages/DashboardPage'; 
import CapsuleCreatorPage from './pages/CapsuleCreatorPage'; 
import CapsuleDetailsPage from './components/Dashboard/CapsuleDetails'; // Import CapsuleDetailsPage
import PublicCapsuleViewPage from './pages/PublicCapsuleViewPage'; // Import the new page
import NotFoundPage from './pages/NotFoundPage'; 
import LandingPage from './pages/LandingPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage'; // Added
import NotificationPage from './pages/NotificationPage'; // Import NotificationPage
import UserProfilePage from './pages/UserProfilePage'; // Import UserProfilePage
import LoadingSpinner from './components/LoadingSpinner'; // Import the spinner


import { NotificationProvider, useNotification } from './hooks/useNotification.jsx'; // Ensure this path is correct


// --- Helper component for root path redirection ---
const AuthRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // getCurrentUser is async, so we must handle the promise
    (async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    })();
  }, [navigate]);
  return null;
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<LoginPageWrapper />}/>
          <Route path="/register" element={<RegisterPageWrapper />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} /> {/* Added route */}

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected routes now wrapped by ProtectedLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-capsule" element={<CapsuleCreatorPage />} />
            <Route path="/capsule/:capsuleId" element={<CapsuleDetailsPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/profile" element={<UserProfilePage />} /> {/* New Profile Route */}
          </Route>
          
          {/* Publicly accessible routes */}
          <Route path="/view-capsule/:accessToken" element={<PublicCapsuleViewPage />} />
          
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

// Wrapper to prevent showing login page if already logged in
function LoginPageWrapper() {
  const navigate = useNavigate();
  const [checking, setChecking] = React.useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser && isMounted) {
        showNotification('You are already logged in.', 'info', 2000);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      if (isMounted) setChecking(false);
    })();
    return () => { isMounted = false; };
  }, [navigate, showNotification]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="h-16 w-16" />
      </div>
    );
  }

  return <LoginPage />;
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  const [checking, setChecking] = React.useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser && isMounted) {
        showNotification('You are already registered and logged in.', 'info', 2000);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      if (isMounted) setChecking(false);
    })();
    return () => { isMounted = false; };
  }, [navigate, showNotification]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="h-16 w-16" />
      </div>
    );
  }

  return <RegisterPage />;
}

export default App;