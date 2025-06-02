// src/services/auth.js
import api from './api';

const authService = {
  /**
   * Logs in a user by sending credentials to the backend.
   * Stores the single DRF token key upon successful login.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} - The response data from the backend (should contain 'key').
   * @throws {Object} - Error response data if login fails.
   */
  login: async (email, password) => {
    try {
      // Assuming your Django backend's login endpoint for Token Auth returns {"key": "..."}
      const response = await api.post('accounts/login/', { email, password });
      // Store the single DRF token key
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during login.' };
    }
  },

  /**
   * Registers a new user. For DRF Token Auth, you might need an extra step to get the token
   * after registration if the register endpoint doesn't return it directly.
   * @param {Object} userData - User registration data (e.g., { email, password, password2 }).
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if registration fails.
   */
  register: async (userData) => {
    try {
      const response = await api.post('accounts/register/', userData);
      console.log(response)
      return response.data;

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred.' };
    }
  },

  /**
   * Sends a password reset email to the provided email address.
   * Endpoint typically provided by Djoser.
   * @param {string} email - The email address to send the reset link to.
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if the request fails.
   */
  forgotPassword: async (email) => {
    try {
      // Djoser's default endpoint for password reset email is 'users/reset_password/'
      const response = await api.post('auth/users/reset_password/', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during password reset request.' };
    }
  },

  /**
   * Confirms the password reset by sending uid, token, and new passwords to the backend.
   * Endpoint typically provided by Djoser.
   * @param {Object} data - Contains uid, token, new_password, and re_new_password.
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if the confirmation fails.
   */
  resetPasswordConfirm: async ({ uid, token, new_password, re_new_password }) => {
    try {
      // Djoser's default endpoint for password reset confirmation is 'users/reset_password_confirm/'
      const response = await api.post('auth/users/reset_password_confirm/', {
        uid,
        token,
        new_password,
        re_new_password,
      });
      return response.data;
    } catch (error) {
      console.error('Reset password confirmation error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during password reset confirmation.' };
    }
  },

  /**
   * Logs out the current user by removing the authToken from localStorage.
   * You might also hit a backend logout endpoint if your DRF setup requires it
   * to invalidate the token server-side (e.g., djoser's 'token/logout/').
   */
  logout: async () => {
    try{
      const response = await api.post('accounts/logout/');
      localStorage.removeItem('authToken');
      console.log('Logout successful:', response.data);
    }
    catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during logout.' };
    }

  },

  /**
   * Checks if a user is currently authenticated by the presence of an authToken.
   * If authenticated, fetches user details from the backend.
   * @returns {Promise<Object|null>} - User object if authenticated, or null.
   */
  getCurrentUser: async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Make an authenticated request to a user details endpoint
        const response = await api.get('accounts/me/');
        // console.log(response);
        return response.data; // Should contain user details like { id, email, name, ... }
      } catch (error) {
        // If the token is invalid or expired, remove it and return null
        localStorage.removeItem('authToken');
        return null;
      }
    }
    return null;
  }
};

export default authService; // Export the consolidated authentication service object
