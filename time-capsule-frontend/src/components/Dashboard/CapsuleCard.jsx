// src/components/Dashboard/CapsuleCard.jsx
import React from 'react';
import Button from '../Button'; // Adjust path if needed

const CapsuleCard = ({ capsule }) => {
  // Dummy content icon based on status
  const getIcon = (status) => {
    switch (status) {
      case 'sealed': return '🔒';
      case 'delivered': return '📬';
      case 'draft': return '📝';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sealed': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Format date for display
  const formattedDate = capsule.scheduled_delivery_date
    ? new Date(capsule.scheduled_delivery_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not scheduled';

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
        Privacy: {capsule.privacy_level.charAt(0).toUpperCase() + capsule.privacy_level.slice(1)}
      </p>
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end space-x-2">
        {capsule.status === 'draft' && (
          <Button variant="secondary" className="px-4 py-2 text-sm">Edit</Button>
        )}
        {capsule.status === 'delivered' && (
          <Button variant="primary" className="px-4 py-2 text-sm">View Content</Button>
        )}
        {capsule.status === 'sealed' && (
          <Button variant="outline" className="px-4 py-2 text-sm">Details</Button>
        )}
        {/* More actions can be added based on status/permissions */}
      </div>
    </div>
  );
};

export default CapsuleCard;