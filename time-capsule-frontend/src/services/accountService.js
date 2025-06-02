import api from './api';

const API_URL = '/accounts/'; // Base URL for account related endpoints

const getProfile = () => {
  return api.get(`${API_URL}profile/`); // Assuming endpoint is /api/accounts/profile/
};

const updateProfile = (profileData) => {
  return api.put(`${API_URL}profile/update/`, profileData); // Assuming endpoint is /api/accounts/profile/update/
};

// Add other account-related functions here, e.g., change password

const accountService = {
  getProfile,
  updateProfile,
};

export default accountService;
