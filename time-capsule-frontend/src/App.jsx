// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import authService from './services/auth'; 

// Import Layout Components
import MainLayout from './components/Layout/MainLayout'; 

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
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'; // Add this import

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
          <Route
            path="/login"
            element={
              <LoginPageWrapper />
            }
          />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} /> {/* Dynamic reset password route */}
          <Route path="/auth-redirect" element={<AuthRedirect />} /> {/* Redirects to dashboard or login based on auth state */}
          
          {/* Protected routes */}

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-capsule" element={<CapsuleCreatorPage />} />
          <Route path="/capsule/:capsuleId" element={<CapsuleDetailsPage />} /> {/* Add route for capsule details */}
          <Route path="/view-capsule/:accessToken" element={<PublicCapsuleViewPage />} /> {/* New public route */}
          
          <Route path="/" element={<LandingPage />} /> {/* Default to Landing Page */}
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for undefined routes */}
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
    // Optionally show a loading spinner or nothing while checking auth
    return null;
  }

  return <LoginPage />;
}

export default App;