// src/services/api.js
import axios from 'axios';

// Get base URL from environment variables
// Make sure VITE_API_BASE_URL is set in your .env file (e.g., VITE_API_BASE_URL=http://localhost:8000/api/)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Authorization header if a token exists
api.interceptors.request.use(
  (config) => {
    // For DRF Token Authentication, we store only one token. Let's call it 'authToken'.
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // The header prefix for DRF Token Authentication is 'Token'
      config.headers.Authorization = `Token ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// No response interceptor for token refreshing needed with DRF's default TokenAuthentication,
// as these tokens typically don't expire quickly or have a refresh mechanism like JWTs.
// Error handling for 401s will now be done directly by the calling component.

export default api;
