// src/services/auth.js
import api from './api';

const API_URL = '/accounts/'; // Your accounts API base URL

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
      // Backend will now create an inactive user and send OTP
      const response = await api.post('accounts/register/', userData);
      console.log(response)
      return response.data;

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred.' };
    }
  },

  /**
   * Verifies the account using the OTP sent to the user's email during registration.
   * @param {string} email - The email address of the user.
   * @param {string} otp - The OTP received by the user.
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if verification fails.
   */
  verifyAccountOTP: async (email, otp) => {
    try {
      const response = await api.post('accounts/verify-account/', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Verify account OTP error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during account verification.' };
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
  },

  /**
   * Requests an OTP for password reset.
   * @param {string} email - The email address to send the OTP to.
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if the request fails.
   */
  requestPasswordResetOTP: async (email) => {
    try {
      const response = await api.post('accounts/password-reset/request-otp/', { email });
      return response.data;
    } catch (error) {
      console.error('Request OTP error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred while requesting OTP.' };
    }
  },

  /**
   * Verifies the OTP sent to the user's email for password reset.
   * @param {string} email - The email address of the user.
   * @param {string} otp - The OTP received by the user.
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if the verification fails.
   */
  verifyPasswordResetOTP: async (email, otp) => {
    try {
      const response = await api.post('accounts/password-reset/verify-otp/', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred while verifying OTP.' };
    }
  },

  /**
   * Sets a new password for the user after verifying the OTP.
   * @param {string} email - The email address of the user.
   * @param {string} password - The new password.
   * @param {string} password2 - Confirmation of the new password.
   * @returns {Promise<Object>} - The response data from the backend.
   * @throws {Object} - Error response data if setting the new password fails.
   */
  setNewPasswordAfterOTP: async (email, password, password2) => {
    try {
      const response = await api.post('accounts/password-reset/set-new-password/', {
        email,
        password,
        password2,
      });
      return response.data;
    } catch (error) {
      console.error('Set new password error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred while setting the new password.' };
    }
  },

  /**
   * Logs in a user using Google authentication.
   * @param {string} idToken - The ID token received from Google Sign-In.
   * @returns {Promise<Object>} - The response data from the backend (should contain 'key').
   * @throws {Object} - Error response data if login fails.
   */
  loginWithGoogle: async (idToken) => {
    try {
      const response = await api.post(API_URL + 'google-login/', { id_token: idToken });
      if (response.data.token) { // Assuming DRF token from backend
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Google login error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during Google login.' };
    }
  },
};

export default authService; // Export the consolidated authentication service object
