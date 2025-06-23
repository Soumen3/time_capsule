// src/services/auth.js
import api from './api';

const API_URL = '/accounts/'; // Your accounts API base URL

const authService = {

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

  verifyAccountOTP: async (email, otp) => {
    try {
      const response = await api.post('accounts/verify-account/', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Verify account OTP error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during account verification.' };
    }
  },


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

  logout: async () => {
    try{
      const response = await api.post('accounts/logout/');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('Logout successful:', response.data);
    }
    catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred during logout.' };
    }

  },


  getCurrentUser: async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Try to get user from localStorage first
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          return JSON.parse(cachedUser);
        } catch {
          // If parsing fails, remove corrupted data
          localStorage.removeItem('user');
        }
      }
      // If not cached, fetch from backend and cache it
      try {
        const response = await api.get('accounts/me/');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  },

  requestPasswordResetOTP: async (email) => {
    try {
      const response = await api.post('accounts/password-reset/request-otp/', { email });
      return response.data;
    } catch (error) {
      console.error('Request OTP error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred while requesting OTP.' };
    }
  },


  verifyPasswordResetOTP: async (email, otp) => {
    try {
      const response = await api.post('accounts/password-reset/verify-otp/', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error.response?.data || error.message);
      throw error.response?.data || { detail: 'An unexpected error occurred while verifying OTP.' };
    }
  },


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
