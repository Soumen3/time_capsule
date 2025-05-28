// src/pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService
import AuthLayout from '../../components/Layout/AuthLayout'; // Import AuthLayout

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handles the form submission for requesting a password reset.
   * Calls the authService.forgotPassword function (which you'll implement on backend).
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Call the forgotPassword method from the authService
      // This endpoint will typically send a password reset email
      await authService.forgotPassword(email);
      setSuccessMessage('If an account with that email exists, a password reset link has been sent to your inbox.');
      setEmail(''); // Clear email field after successful submission
    } catch (err) {
      // Handle errors (e.g., email not found, rate limiting)
      setError(err.detail || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout> {/* Apply the AuthLayout for consistent styling */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Forgot Password?</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          <Input
            label="Email"
            id="forgot-password-email"
            type="email"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
