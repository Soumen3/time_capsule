// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService
import AuthLayout from '../../components/Layout/AuthLayout';
import MainLayout from '../../components/Layout/MainLayout';
import { useNotification } from '../../hooks/useNotification';
import { GoogleLogin } from '@react-oauth/google'; // Import the component

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // For password confirmation
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();


  /**
   * Handles the form submission for user registration.
   * Prevents default form submission, sets loading state,
   * performs client-side password matching validation,
   * calls the authService.register function, and handles success/error.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError(''); // Clear any previous errors

    // Client-side validation: Check if passwords match
    if (password !== password2) {
      setError('Passwords do not match.');
      showNotification('Passwords do not match.', 'error');
      return; // Stop submission if passwords don't match
    }
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
    }


    setLoading(true); // Set loading state to true

    try {
      const response = await authService.register({ 
        email, 
        password, 
        password2, 
        name: fullName, 
        dob 
      });
      
      showNotification(response.message || 'Registration successful. Check email for OTP.', 'success');
      // Navigate to OTP verification page, passing the email
      navigate('/verify-email', { state: { email: response.email || email } });

    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'Registration failed. Please try again.';
      if (errorData) {
        if (errorData.email) errorMessage = `Email: ${errorData.email.join(', ')}`;
        else if (errorData.password) errorMessage = `Password: ${errorData.password.join(', ')}`;
        else if (errorData.name) errorMessage = `Name: ${errorData.name.join(', ')}`;
        else if (errorData.detail) errorMessage = errorData.detail;
        else if (typeof errorData === 'string') errorMessage = errorData;
        else {
            // Handle cases where errorData is an object with multiple field errors
            const fieldErrors = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('; ');
            if (fieldErrors) errorMessage = fieldErrors;
        }
      }
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      await authService.loginWithGoogle(credentialResponse.credential);
      showNotification('Google sign-up successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Google sign-up failed. Please try again.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google login error');
    const errorMessage = 'Google sign-up failed. Please try again.';
    setError(errorMessage);
    showNotification(errorMessage, 'error');
    setLoading(false);
  };

  return (
    <MainLayout> {/* Using AuthLayout */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md justify-self-center">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Your Time Capsule Account</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <Input
            label="Full Name"
            id="fullName"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Date of Birth"
            id="dob"
            type="date"
            placeholder="YYYY-MM-DD"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
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
          <Input
            label="Confirm Password"
            id="password2"
            type="password"
            placeholder="********"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            // Display client-side error if passwords don't match
            error={password !== password2 && password2.length > 0 ? 'Passwords do not match' : ''}
          />
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        {/* SSO Options Separator */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">Or sign up with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* SSO Options */}
        <div className="flex flex-col items-center space-y-3">
            {/* GoogleLogin component will render Google's button */}
            {loading && <p className="text-sm text-gray-500">Processing Google Sign-Up...</p>}
            {!loading && (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
                useFedCM={false} // Explicitly disable FedCM
                shape="rectangular"
                theme="outline"
                size="large"
                width="318px" // Adjust width as needed
                text='Sign up with Google'
              />
            )}
            
            {/* Facebook SSO Icon Button (Placeholder) */}
            {/* <button
              type="button"
              onClick={() => alert('Facebook SSO not yet implemented')}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 flex items-center justify-center"
              title="Sign up with Facebook"
            >
              <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
            </button> */}

            {/* Apple SSO Icon Button (Placeholder) */}
            {/* <button
              type="button"
              onClick={() => alert('Apple SSO not yet implemented')}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 flex items-center justify-center"
              title="Sign up with Apple"
            >
              <img src="/apple.png" alt="Apple" className="w-6 h-6" />
            </button> */}
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
