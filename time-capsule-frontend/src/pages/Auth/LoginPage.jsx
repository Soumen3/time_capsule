// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService from your Canvas
import MainLayout from '../../components/Layout/MainLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      await authService.login(email, password);
      navigate('/dashboard'); // Redirect to the dashboard on successful login
    } catch (err) {
      // Handle errors from the backend. The authService is designed to throw
      // the backend's error response data (e.g., { detail: "Invalid credentials" }).
      // Display a user-friendly error message.
      setError(err.detail || err.email || err.password || err.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Reset loading state
    }
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
          <p className="text-center text-gray-600 text-sm mt-6">
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
