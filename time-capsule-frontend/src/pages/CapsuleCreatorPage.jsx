// src/pages/CapsuleCreatorPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth'; // Adjust path if needed
import MainLayout from '../components/Layout/MainLayout'; // Adjust path if needed
import Button from '../components/Button'; // Adjust path if needed

const CapsuleCreatorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // For multi-step form

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Loading...
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Step 1: Capsule Details</h3>
            <p className="text-gray-600">Enter a title and description for your time capsule.</p>
            {/* Add Input components here for title, description */}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Step 2: Add Content</h3>
            <p className="text-gray-600">Include messages, photos, videos, or documents.</p>
            {/* Add MediaUploadInput, Textarea for content */}
            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(1)} variant="secondary">Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Step 3: Choose Recipients</h3>
            <p className="text-gray-600">Decide who will receive this capsule (yourself, friends, public).</p>
            {/* Add RecipientSelector components */}
            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(2)} variant="secondary">Back</Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Step 4: Set Delivery Schedule</h3>
            <p className="text-gray-600">Specify when and how the capsule will be delivered.</p>
            {/* Add DatePicker, TimePicker, SMS/Email options */}
            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(3)} variant="secondary">Back</Button>
              <Button onClick={() => setStep(5)}>Next</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Step 5: Review & Confirm</h3>
            <p className="text-gray-600">Review all details before sealing your capsule.</p>
            {/* Display summary of all inputs */}
            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(4)} variant="secondary">Back</Button>
              <Button onClick={() => alert('Capsule Sealed! (Not really, backend needed)')}>Seal Capsule</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Your Time Capsule</h2>
        <div className="p-6 border border-gray-200 rounded-lg text-left">
          {renderStepContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default CapsuleCreatorPage;