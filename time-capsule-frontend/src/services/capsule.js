// import authService from './auth'; // authService.getCurrentUser() no longer used for token retrieval here
import api from './api'; // Import the configured axios instance

// Assuming VITE_API_URL is used for consistency with api.js if it's a Vite project.
// If it's Create React App, REACT_APP_API_URL is correct.
// Sticking to the provided REACT_APP_API_URL for now.
const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api'; 

const createCapsule = async (capsuleData) => {
  const authToken = localStorage.getItem('authToken'); // Retrieve token directly from localStorage
  
  if (!authToken) { 
    throw new Error('User not authenticated or token not found in localStorage');
  }

  const formData = new FormData();
  formData.append('title', capsuleData.title);
  formData.append('description', capsuleData.description);
  // Backend might expect content_message or similar for the text content
  formData.append('text_content', capsuleData.contentMessage); // Assuming one primary text message
  formData.append('recipient_email', capsuleData.recipientEmail); // Assuming one recipient for now
  formData.append('delivery_date', capsuleData.deliveryDate);
  formData.append('delivery_time', capsuleData.deliveryTime);
  // Add other capsule-level fields like privacy_status, delivery_method if needed

  // Append media files
  if (capsuleData.mediaFiles && capsuleData.mediaFiles.length > 0) {
    capsuleData.mediaFiles.forEach((file) => {
      formData.append('media_files', file, file.name); // 'media_files' is a placeholder key
    });
  }

  // Log FormData content for debugging
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}: ${value}`);
  // }

  const response = await fetch(`${API_URL}/capsules/create/`, { // Adjust endpoint as needed
    method: 'POST',
    headers: {
      'Authorization': `Token ${authToken}`, // Use the retrieved authToken
    //   'Content-Type': 'multipart/form-data' // is automatically set by browser when using FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create capsule and parse error' }));
    console.error('Capsule creation failed:', errorData);
    throw new Error(errorData.detail || errorData.message || 'Failed to create capsule');
  }

  return response.json();
};

const getCapsules = async () => {
  // Token is automatically added by the axios interceptor in api.js
  try {
    // The endpoint '/capsules/' will be appended to the baseURL in api.js
    // This assumes your backend endpoint for listing capsules is '/api/capsules/'
    const response = await api.get('/capsules/'); 
    return response.data; // Axios returns the response data directly in `response.data`
  } catch (error) {
    console.error('Failed to fetch capsules:', error.response || error.message);
    const errorDetails = error.response?.data;
    const errorMessage = errorDetails?.detail || errorDetails?.message || error.message || 'Failed to fetch capsules';
    throw new Error(errorMessage);
  }
};

const getCapsuleById = async (capsuleId) => {
  try {
    const response = await api.get(`/capsules/${capsuleId}/`); // Assumes endpoint like /api/capsules/{id}/
    return response.data;

  } catch (error) {
    const errorDetails = error.response?.data;
    const errorMessage = errorDetails?.detail || errorDetails?.message || errorDetails?.error || error.message || `Failed to fetch capsule ${capsuleId}`;
    throw new Error(errorMessage);
  }
};

const getPublicCapsuleByToken = async (token) => {
  try {
    // This request does not need an Authorization header
    const response = await api.get(`/capsules/public/capsules/${token}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public capsule by token:', error.response || error);
    // Rethrow or handle as appropriate for your UI
    throw error.response?.data || new Error('Failed to load capsule. The link may be invalid or expired.');
  }
};

const deleteCapsule = async (capsuleId) => {
  try {
    const response = await api.delete(`/capsules/${capsuleId}/delete/`);
    return response.data; // Or response itself if 204 No Content
  } catch (error) {
    console.error(`Error deleting capsule ${capsuleId}:`, error.response || error);
    throw error;
  }
};

const capsuleService = {
  createCapsule,
  getCapsules,
  getCapsuleById, // Add the new function
  getPublicCapsuleByToken, // New method for fetching public capsule data
  deleteCapsule, // New method for deleting a capsule
};

export default capsuleService;
