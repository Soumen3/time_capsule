// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust path if needed
import Button from '../../components/Button'; // Adjust path if needed
import authService from '../../services/auth'; // Import the authService

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // For password confirmation
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      return; // Stop submission if passwords don't match
    }

    setLoading(true); // Set loading state to true

    try {
      // Call the register method from the authService
      // Assuming backend expects password2 for confirmation
      await authService.register({ 
        email, 
        password, 
        password2, 
        name: fullName, 
        dob 
      });

      // On successful registration, redirect to the login page.
      // You might add a query parameter to display a success message on the login page.
      navigate('/login?registered=true');
    } catch (err) {
      // Handle errors from the backend. The authService is designed to throw
      // the backend's error response data.
      // Display a user-friendly error message.
      // Common errors: email already exists, password validation issues.
      setError(
        err.detail || // General error message from backend
        err.email?.[0] || // Specific error for email field
        err.password?.[0] || // Specific error for password field
        'Registration failed. Please try again.' // Generic fallback
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
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
            error={password !== password2 && password2 !== '' ? 'Passwords do not match' : ''}
          />
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
