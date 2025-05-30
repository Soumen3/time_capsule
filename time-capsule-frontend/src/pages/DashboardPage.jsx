// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import capsuleService from '../services/capsule'; // Import capsuleService
import MainLayout from '../components/Layout/MainLayout';
import CapsuleList from '../components/Dashboard/CapsuleList';
import { useNotification } from '../hooks/useNotification'; // Import useNotification

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCapsules, setUserCapsules] = useState([]);
  const [fetchError, setFetchError] = useState(''); // State for API fetch errors
  const { showNotification } = useNotification(); // Get showNotification from hook

  useEffect(() => {
    const checkAuthAndLoadCapsules = async () => {
      setLoading(true);
      setFetchError('');
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      try {
        const capsulesData = await capsuleService.getCapsules();
        // The backend response for a list view might be an array directly,
        // or an object with a 'results' key if using DRF pagination.
        // Adjust based on your backend's response structure.
        // Assuming it's an array of capsules for now.
        setUserCapsules(capsulesData || []); 
      } catch (err) {
        console.error("Failed to fetch capsules:", err);
        setFetchError(err.message || "Could not load your capsules. Please try again later.");
        showNotification(err.message || "Could not load capsules.", 'error');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadCapsules();
  }, [navigate, showNotification]);

  const handleLogout = () => {
    authService.logout();
    showNotification('You have been logged out.', 'info'); // Show logout notification
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  // Filter capsules based on their actual status from the backend
  // Assuming backend returns 'is_delivered' and 'is_archived'
  // We might need to infer 'status' or have the backend provide it directly.
  // For now, let's map backend fields to the frontend's expected 'status'.
  const processedCapsules = userCapsules.map(capsule => {
    let status = 'draft'; // Default status
    console.log(capsule)
    if (capsule.is_delivered) {
      // Check if any recipient has opened the capsule
      const hasBeenOpened = capsule.recipients && capsule.recipients.some(
        recipient => recipient.received_status === 'opened'
      );
      status = hasBeenOpened ? 'opened' : 'delivered'; // Set to 'opened' if any recipient opened it
    } else if (!capsule.is_archived && capsule.delivery_date) { // Assuming non-archived with a delivery date are 'sealed'
      status = 'sealed';
    }
    // Add other logic if your backend provides a direct status field or more complex conditions
    return { ...capsule, status };
  });

  const sealedCapsules = processedCapsules.filter(c => c.status === 'sealed');
  // Delivered capsules are those marked 'delivered' but not 'opened'
  const deliveredCapsules = processedCapsules.filter(c => c.status === 'delivered');
  // Opened capsules are those specifically marked 'opened'
  const openedCapsules = processedCapsules.filter(c => c.status === 'opened');
  const draftCapsules = processedCapsules.filter(c => c.status === 'draft'); // Or however 'draft' is determined

  return (
    <MainLayout>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h2>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your personal Time Capsule dashboard, {user?.email || 'User'}!
        </p>
      </div>

      {fetchError && (
        <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {fetchError}</span>
        </div>
      )}

      <div className="w-full max-w-4xl space-y-8">
        <CapsuleList capsules={sealedCapsules} title="Sealed & Upcoming Capsules" />
        <CapsuleList capsules={deliveredCapsules} title="Delivered (Not Yet Opened)" />
        <CapsuleList capsules={openedCapsules} title="Opened Capsules" />
        <CapsuleList capsules={draftCapsules} title="Draft Capsules" />
      </div>

    </MainLayout>
  );
};

export default DashboardPage;
