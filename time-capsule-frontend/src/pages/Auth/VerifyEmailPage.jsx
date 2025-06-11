import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import authService from '../../services/auth';
import AuthLayout from '../../components/Layout/AuthLayout';
import { useNotification } from '../../hooks/useNotification';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Extract email from navigation state or redirect if not present
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      showNotification('Email not provided for verification. Please register again.', 'error');
      navigate('/register');
    }
  }, [email, navigate, showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
        setError('Email is missing. Cannot verify OTP.');
        showNotification('Email is missing. Cannot verify OTP.', 'error');
        setLoading(false);
        return;
    }

    try {
      const response = await authService.verifyAccountOTP(email, otp);
      showNotification(response.detail || 'Account verified successfully! You can now log in.', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.otp?.join(', ') || 'OTP verification failed. Please try again or register to get a new OTP.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle resend OTP logic (optional, but good UX)
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      // This assumes your backend `register` endpoint can be called again to resend OTP
      // or you have a dedicated `resend-otp` endpoint.
      // For simplicity, we'll re-trigger a process similar to initial OTP send.
      // A dedicated backend endpoint for resending OTP for an existing inactive user is better.
      // For now, let's assume a simplified re-registration call or a dedicated resend endpoint.
      // If using register again, it might create a new user or update OTP for existing inactive one.
      // This part needs careful backend design for "resend OTP".
      // For this example, we'll simulate a call to `requestPasswordResetOTP` as it's similar logic.
      // Ideally, you'd have `authService.resendVerificationOTP(email)`
      await authService.requestPasswordResetOTP(email); // Placeholder for actual resend logic
      showNotification('A new OTP has been sent to your email.', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to resend OTP. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };


  if (!email) {
    // This will be briefly shown before useEffect redirects
    return (
        <AuthLayout>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
                <p className="text-red-500">Required information missing. Redirecting...</p>
            </div>
        </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Verify Your Email</h2>
        <p className="text-gray-600 text-center mb-6">
          An OTP has been sent to <strong>{email}</strong>. Please enter it below to activate your account.
        </p>
        <form onSubmit={handleSubmit}>
          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <Input
            label="OTP"
            id="otp-verification"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            disabled={loading}
          />
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </Button>
        </form>
        <div className="text-center mt-4">
            <button 
                onClick={handleResendOtp} 
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
                {loading ? 'Sending...' : 'Resend OTP'}
            </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">
          Entered wrong email?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Register again
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
