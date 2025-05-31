// src/components/Dashboard/CapsuleCard.jsx
import React from 'react';
import Button from '../Button'; // Adjust path if needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import capsuleService from '../../services/capsule'; // Import capsuleService
import { useNotification } from '../../hooks/useNotification'; // Import useNotification

const CapsuleCard = ({ capsule, onDeleteSuccess }) => {
  const navigate = useNavigate(); // Initialize navigate
  const { showNotification } = useNotification(); // For showing success/error messages

  // Dummy content icon based on status
  const getIcon = (status) => {
    switch (status) {
      case 'sealed': return '🔒';
      case 'delivered': return '📬';
      case 'opened': return '📭'; // Unicode for "Open" or use an emoji like '👀' or '✅'
      case 'draft': return '📝';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sealed': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'opened': return 'text-purple-600 bg-purple-100'; // New color for opened
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Format date for display
  const formattedDate = capsule.delivery_date // Use delivery_date from backend
    ? new Date(capsule.delivery_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not scheduled';

  // Safely access privacy_status and provide a default
  const privacyDisplay = capsule.privacy_status
    ? capsule.privacy_status.charAt(0).toUpperCase() + capsule.privacy_status.slice(1)
    : 'N/A';

  const handleViewDetails = () => {
    navigate(`/capsule/${capsule.id}`); // Navigate to the details page
  };

  const handleDelete = async () => {
    // Simple confirmation, ideally use a modal
    if (window.confirm(`Are you sure you want to delete the capsule "${capsule.title}"? This action cannot be undone.`)) {
      try {
        await capsuleService.deleteCapsule(capsule.id);
        showNotification(`Capsule "${capsule.title}" deleted successfully.`, 'success');
        if (onDeleteSuccess) {
          onDeleteSuccess(capsule.id); // Callback to update parent component's state
        }
      } catch (error) {
        console.error("Failed to delete capsule:", error);
        showNotification(error.response?.data?.error || error.message || 'Failed to delete capsule.', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 p-6 flex flex-col border border-gray-200">
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-4">{getIcon(capsule.status)}</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{capsule.title}</h3>
          <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusColor(capsule.status)}`}>
            {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
          </p>
        </div>
      </div>
      <p className="text-gray-600 mb-2 flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Delivery: {formattedDate}
      </p>
      <p className="text-gray-600 mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path></svg>
        Privacy: {privacyDisplay}
      </p>
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end space-x-2 items-center"> {/* Added items-center */}
        {capsule.status === 'draft' && (
          <Button variant="secondary" className="px-3 py-1.5 text-xs">Edit</Button> 
        )}
        {(capsule.status === 'delivered' || capsule.status === 'opened') && (
          <Button variant="primary" className="px-3 py-1.5 text-xs" onClick={handleViewDetails}>View Content</Button>
        )}
        {capsule.status === 'sealed' && (
          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={handleViewDetails}>Details</Button>
        )}
        {/* Delete button - consider conditions for showing it (e.g., not for delivered/opened) */}
        {/* For now, allowing delete for any status owned by the user */}
        <Button 
          variant="danger" 
          className="px-2 py-1.5 text-xs" // Adjusted padding for icon button
          onClick={handleDelete}
          title="Delete Capsule" // Added title for accessibility
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {/* Optionally, add text next to icon if desired, e.g., <span className="ml-1">Delete</span> */}
        </Button>
        {/* More actions can be added based on status/permissions */}
      </div>
    </div>
  );
};

export default CapsuleCard;