// src/pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService
import AuthLayout from '../../components/Layout/AuthLayout'; // Import AuthLayout
import { useNotification } from '../../hooks/useNotification'; // Assuming you have this

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use requestPasswordResetOTP from authService
      const response = await authService.requestPasswordResetOTP(email);
      showNotification(response.detail || 'OTP sent to your email.', 'success');
      // Backend might return the email (e.g. if normalized), use it.
      setEmail(response.email || email); 
      setStep(2);
    } catch (err) {
      const errorMsg = err.response?.data?.email?.join(', ') || err.response?.data?.detail || 'Failed to send OTP. Please check the email and try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.verifyPasswordResetOTP(email, otp);
      showNotification(response.detail || 'OTP verified successfully.', 'success');
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.otp?.join(', ') || err.response?.data?.detail || 'Invalid or expired OTP.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== password2) {
      const msg = 'Passwords do not match.';
      setError(msg);
      showNotification(msg, 'error');
      return;
    }
    if (password.length < 8) { // Basic frontend validation
      const msg = 'Password must be at least 8 characters long.';
      setError(msg);
      showNotification(msg, 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.setNewPasswordAfterOTP(email, password, password2);
      showNotification(response.detail || 'Password reset successfully. Please log in.', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.password?.join(', ') || err.response?.data?.detail || 'Failed to reset password.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout> {/* Apply the AuthLayout for consistent styling */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Forgot Password?</h2>
            <p className="text-gray-600 text-center mb-6">
              Enter your email address to receive an OTP.
            </p>
            <form onSubmit={handleEmailSubmit}>
              {error && !loading && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
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
                disabled={loading}
              />
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Enter OTP</h2>
            <p className="text-gray-600 text-center mb-6">
              An OTP has been sent to {email}. Please enter it below.
            </p>
            <form onSubmit={handleOtpSubmit}>
              {error && !loading && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <Input
                label="OTP"
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                disabled={loading}
              />
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button type="button" variant="secondary" className="w-full mt-3" onClick={() => { setStep(1); setError(''); setOtp('');}} disabled={loading}>
                 Back to Email
              </Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Set New Password</h2>
            <p className="text-gray-600 text-center mb-6">
              Enter your new password for {email}.
            </p>
            <form onSubmit={handleNewPasswordSubmit}>
              {error && !loading && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <Input
                label="New Password"
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Confirm New Password"
                id="confirm-new-password"
                type="password"
                placeholder="Confirm new password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                className="mt-4"
                disabled={loading}
              />
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Saving...' : 'Set New Password'}
              </Button>
            </form>
          </>
        )}

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
