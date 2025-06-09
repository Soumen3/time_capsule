import api from './api';

const API_URL = '/accounts/'; // Base URL for account related endpoints

const getProfile = () => {
  return api.get(`${API_URL}profile/`); // Assuming endpoint is /api/accounts/profile/
};

const updateProfile = (profileData) => {
  return api.put(`${API_URL}profile/`, profileData); // Assuming endpoint is /api/accounts/profile/
};

const changePassword = (passwordData) => {
  // Ensure your backend expects 'old_password', 'new_password', 'new_password2'
  // The endpoint might be 'profile/change-password/' or similar
  return api.post(`${API_URL}profile/change-password/`, passwordData); 
};

const accountService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default accountService;
