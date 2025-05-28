// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import MainLayout from '../components/Layout/MainLayout';
import CapsuleList from '../components/Dashboard/CapsuleList';
import { useNotification } from '../hooks/useNotification'; // Import useNotification

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCapsules, setUserCapsules] = useState([]);
  const { showNotification } = useNotification(); // Get showNotification from hook

  useEffect(() => {
    const checkAuthAndLoadCapsules = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // --- Dummy Data for Capsules (Replace with actual API call later) ---
      const dummyCapsules = [
        {
          id: '1',
          title: 'Message to my Future Self',
          delivery_date: '2028-05-27T10:00:00Z',
          scheduled_delivery_date: '2028-05-27T10:00:00Z',
          status: 'sealed',
          privacy_level: 'private',
        },
        {
          id: '2',
          title: 'Family Memories 2025',
          delivery_date: '2043-01-01T00:00:00Z',
          scheduled_delivery_date: '2043-01-01T00:00:00Z',
          status: 'sealed',
          privacy_level: 'shared',
        },
        {
          id: '3',
          title: 'My 20th Birthday Reflections',
          delivery_date: '2025-05-15T09:00:00Z',
          scheduled_delivery_date: '2025-05-15T09:00:00Z',
          status: 'delivered',
          privacy_level: 'private',
        },
        {
          id: '4',
          title: 'Dream Project Draft',
          delivery_date: null,
          scheduled_delivery_date: null,
          status: 'draft',
          privacy_level: 'private',
        },
        {
          id: '5',
          title: 'Wedding Day Wishes',
          delivery_date: '2035-07-20T14:00:00Z',
          scheduled_delivery_date: '2035-07-20T14:00:00Z',
          status: 'sealed',
          privacy_level: 'public',
        },
      ];
      setUserCapsules(dummyCapsules);
      // --- End Dummy Data ---

      setLoading(false);
    };

    checkAuthAndLoadCapsules();
  }, [navigate]);

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

  const sealedCapsules = userCapsules.filter(c => c.status === 'sealed');
  const deliveredCapsules = userCapsules.filter(c => c.status === 'delivered');
  const draftCapsules = userCapsules.filter(c => c.status === 'draft');

  return (
    <MainLayout>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h2>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your personal Time Capsule dashboard, {user?.email || 'User'}!
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        <CapsuleList capsules={sealedCapsules} title="Sealed & Upcoming Capsules" />
        <CapsuleList capsules={deliveredCapsules} title="Delivered Capsules" />
        <CapsuleList capsules={draftCapsules} title="Draft Capsules" />
      </div>

    </MainLayout>
  );
};

export default DashboardPage;
