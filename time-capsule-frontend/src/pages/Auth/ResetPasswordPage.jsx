// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService
import AuthLayout from '../../components/Layout/AuthLayout'; // Import AuthLayout

const ResetPasswordPage = () => {
  // Get uid and token from URL parameters
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handles the form submission for resetting the password.
   * Performs client-side validation for password matching.
   * Calls the authService.resetPasswordConfirm function.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Client-side validation: Check if passwords match
    if (newPassword !== reNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Call the resetPasswordConfirm method from the authService
      // This endpoint will typically verify uid/token and set the new password
      await authService.resetPasswordConfirm({
        uid,
        token,
        new_password: newPassword,
        re_new_password: reNewPassword,
      });
      setSuccessMessage('Your password has been reset successfully! You can now log in with your new password.');
      setNewPassword('');
      setReNewPassword('');
      // Optionally redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      // Handle errors (e.g., invalid uid/token, password validation errors)
      setError(
        err.detail ||
        err.new_password?.[0] || // Djoser often returns array for password errors
        'Failed to reset password. Please check the link or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Display a message if uid or token are missing from the URL
  if (!uid || !token) {
    return (
      <AuthLayout>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is missing required information. Please ensure you
            copied the full link from your email.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary">Request a New Reset Link</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout> {/* Apply the AuthLayout for consistent styling */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Reset Your Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
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
            label="New Password"
            id="new-password"
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            id="re-new-password"
            type="password"
            placeholder="********"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            required
            error={newPassword !== reNewPassword && reNewPassword !== '' ? 'Passwords do not match' : ''}
          />
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Back to Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
