import React, { useState, useEffect } from 'react';
import accountService from '../services/accountService'; // Assuming you create this
import authService from '../services/auth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNotification } from '../hooks/useNotification';

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Form states for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Email might not be editable, or require special handling
    bio: '',
    // Add other fields you want to allow editing for
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await accountService.getProfile();
        setProfile(response.data);
        // console.log(response.data); // Original console.log
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          dob: response.data.dob || '', // Ensure 'dob' is the correct key from backend or initialize appropriately
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data. Please try again later.');
        if (err.response && err.response.status === 401) {
          showNotification('Session expired. Please log in again.', 'error');
          authService.logout(); // Clear local auth state
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, showNotification]);

  const handleInputChange = (e) => {
    console.log('Event target:', e.target); // Log the whole e.target object
    console.log('Event target name attribute:', e.target.name); // Specifically log the name attribute
    console.log('Event target value attribute:', e.target.value); // Specifically log the value attribute

    const { name, value } = e.target;
    // More explicit logging for the destructured variables
    console.log(`Input changed - Destructured name: '${name}', Destructured value: '${value}'`); 
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Use for submission loading
    setError('');
    try {
      const response = await accountService.updateProfile(formData);
      setProfile(response.data); // Update profile with new data from response
      showNotification('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Failed to update profile.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) { // Show full page loader only on initial load
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="h-16 w-16" />
      </div>
    );
  }

  if (error && !profile) { // Show error if profile couldn't be loaded at all
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }
  
  if (!profile) { // Should ideally be caught by loading or error state
    return <div className="text-center p-8">No profile data found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Profile</h1>
        
        {error && !isEditing && <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}

        {!isEditing ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg text-gray-700">{profile.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg text-gray-700">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-lg text-gray-700 whitespace-pre-wrap">{profile.dob ? new Date(profile.dob + 'T00:00:00').toLocaleDateString() : 'DOB not set'}</p> 
                {/* Added T00:00:00 to ensure date is parsed correctly if it's just YYYY-MM-DD */}
              </div>
              {/* Display other profile fields here */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Joined</label>
                <p className="text-lg text-gray-700">{new Date(profile.created_at || profile.date_joined).toLocaleDateString()}</p> 
                {/* Adjusted to check for created_at or date_joined from backend */}
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => setIsEditing(true)} variant="primary">Edit Profile</Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                disabled={false} // Typically email is not changed easily or used as an identifier
                title="Email cannot be changed through this form."
              />
               <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of birth</label>
              <input
                type="date"
                name="dob" // Changed from "bio" to "dob"
                id="dob"   // Changed from "bio" to "dob"
                value={formData.dob || ''} // Ensure value is empty string if null/undefined for date input
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Add other editable fields here */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" onClick={() => { setIsEditing(false); setError(''); }} variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
