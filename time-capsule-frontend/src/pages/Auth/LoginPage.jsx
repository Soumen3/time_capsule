// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService
import MainLayout from '../../components/Layout/MainLayout';
// import { useGoogleLogin } from '@react-oauth/google'; // No longer using the hook directly here
import { GoogleLogin } from '@react-oauth/google'; // Import the component
import { useNotification } from '../../hooks/useNotification'; // Assuming you have this

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // For notifications

  /**
   * Handles the form submission for user login.
   * Prevents default form submission, sets loading state,
   * calls the authService.login function, and handles success/error.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError(''); // Clear any previous errors
    setLoading(true); // Set loading state to true

    try {
      // Call the login method from the authService
      const userData = await authService.login(email, password);
      showNotification('Login successful!', 'success'); // Added notification
      navigate('/dashboard'); // Redirect to the dashboard on successful login
    } catch (err) {
      // Handle errors from the backend. The authService is designed to throw
      // the backend's error response data (e.g., { detail: "Invalid credentials" }).
      // Display a user-friendly error message.
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err.response?.data) {
        const data = err.response.data;
        if (data.needsVerification) {
          errorMessage = data.error || 'Account not verified. Please check your email for OTP.';
          // Optionally navigate to OTP page if email is provided
          if (data.email) {
            setTimeout(() => navigate('/verify-email', { state: { email: data.email } }), 1000);
          }
        } else {
          errorMessage = data.detail || data.error || data.email?.[0] || data.password?.[0] || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      showNotification(errorMessage, 'error'); // Added notification
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      // The credentialResponse object directly contains the 'credential' (ID token)
      await authService.loginWithGoogle(credentialResponse.credential);
      showNotification('Google login successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Google login failed. Please try again.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => { // The component's onError doesn't provide detailed errorResponse like the hook
    console.error('Google login error');
    const errorMessage = 'Google login failed. Please try again.';
    setError(errorMessage);
    showNotification(errorMessage, 'error');
    setLoading(false); // Ensure loading is reset
  };

  return (
    <MainLayout>
      <div className="min-h-fit flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login to Time Capsule</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end mb-2">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* SSO Options Separator */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* SSO Options */}
          <div className="flex flex-col items-center space-y-3">
            {/* GoogleLogin component will render Google's button */}
            {loading && <p className="text-sm text-gray-500">Processing Google Sign-In...</p>}
            {!loading && (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap // Optional: for a more seamless experience if the user is already signed into Google
                useFedCM={false} // Explicitly disable FedCM
                shape="circle" // "rectangular", "pill", "circle", "square"
                theme="outline"     // "outline", "filled_blue", "filled_black"
                size="large"        // "small", "medium", "large"
                width="318px" // Approximate width of other inputs/buttons for consistency
              />
            )}
            
            {/* Facebook SSO Icon Button (Placeholder) */}
            {/* <button
              type="button"
              onClick={() => alert('Facebook SSO not yet implemented')}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 flex items-center justify-center"
              title="Sign in with Facebook"
            >
              <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
            </button> */}

            {/* Apple SSO Icon Button (Placeholder) */}
            {/* <button
              type="button"
              onClick={() => alert('Apple SSO not yet implemented')}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 flex items-center justify-center"
              title="Sign in with Apple"
            >
              <img src="/apple.png" alt="Apple" className="w-6 h-6" />
            </button> */}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
