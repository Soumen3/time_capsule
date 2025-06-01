// src/pages/CapsuleCreatorPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth'; // Adjust path if needed
import capsuleService from '../services/capsule'; // Import the capsule service
import Button from '../components/Button'; // Adjust path if needed
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import MediaUploadInput from '../components/MediaUploadInput'; // Adjust path if needed
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the spinner
// Consider adding a Notification component for user feedback
// import Notification from '../components/Notification';

const CapsuleCreatorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Page loading
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission loading
  const [error, setError] = useState(''); // API error message
  const [successMessage, setSuccessMessage] = useState(''); // API success message
  const [step, setStep] = useState(1);

  // State for all form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [contentMessage, setContentMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="h-16 w-16" />
      </div>
    );
  }

  // Handle form submission on "Seal Capsule"
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const capsuleData = {
      title,
      description,
      mediaFiles, // This is an array of File objects
      contentMessage,
      recipientEmail,
      deliveryDate,
      deliveryTime,
    };

    console.log('Submitting capsule data:', capsuleData);

    try {
      const response = await capsuleService.createCapsule(capsuleData);
      console.log('Capsule created successfully:', response);
      setSuccessMessage('Capsule created successfully! Redirecting...');
      // Optionally reset form or redirect
      setTimeout(() => {
        navigate('/dashboard'); // Or to a page showing the created capsule
      }, 2000);
    } catch (err) {
      console.error('Failed to create capsule:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Step 1: Capsule Details</h3>
            <p className="text-gray-600">Enter a title and description for your time capsule.</p>
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Capsule Title"
                className="mb-4"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Capsule Description"
                className="mb-4"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
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
            <div className="mt-4">
              <MediaUploadInput
                label="Upload Media (images, videos, documents)"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                multiple
                onChange={setMediaFiles}
                initialFiles={mediaFiles}
              />
              <Textarea
                placeholder="Add a message or note"
                className="mt-4"
                rows={4}
                value={contentMessage}
                onChange={e => setContentMessage(e.target.value)}
              />
            </div>
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
            <p className="text-gray-600">Enter the email where you get the capsule.</p>
            <div className="mt-4">
              <Input
                type="email"
                placeholder="Recipient Email"
                className="mb-4"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
              />
            </div>
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
            <div className="mt-4">
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <DatePicker 
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <TimePicker 
                    value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-800">
                    Your capsule will be delivered to the recipient on the selected date and time.
                  </p>
                </div>
              </div>
            </div>
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
            {/* Error and Success Messages */}
            {error && <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}
            {successMessage && <div className="my-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">{successMessage}</div>}
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
              <h4 className="text-lg font-bold mb-2 text-gray-800">Capsule Summary</h4>
              {/* Title */}
              <div className="mb-2 flex items-center">
                <span className="font-semibold mr-2">Title:</span>
                <span>{title || <span className="text-gray-400">Not provided</span>}</span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(1)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
              {/* Description */}
              <div className="mb-2 flex items-center">
                <span className="font-semibold mr-2">Description:</span>
                <span>{description || <span className="text-gray-400">Not provided</span>}</span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(1)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
              {/* Media Files */}
              <div className="mb-2 flex items-start">
                <span className="font-semibold mr-2">Media Files:</span>
                <span>
                  {mediaFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {mediaFiles.map((file, idx) => {
                        const url = file.type.startsWith('image/') || file.type.startsWith('video/') ? URL.createObjectURL(file) : null;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            {file.type.startsWith('image/') && url && (
                              <img src={url} alt={file.name} className="h-16 w-16 object-cover rounded mb-1 border" />
                            )}
                            {file.type.startsWith('video/') && url && (
                              <video src={url} className="h-16 w-16 rounded mb-1 border" controls={false} muted />
                            )}
                            {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
                              <span className="text-gray-500 text-2xl mb-1">📄</span>
                            )}
                            <span className="text-xs text-gray-700 truncate max-w-[70px]">{file.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-400 ml-2">No files selected</span>
                  )}
                </span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(2)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
              {/* Message */}
              <div className="mb-2 flex items-center">
                <span className="font-semibold mr-2">Message:</span>
                <span>{contentMessage || <span className="text-gray-400">Not provided</span>}</span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(2)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
              {/* Recipient Email */}
              <div className="mb-2 flex items-center">
                <span className="font-semibold mr-2">Recipient Email:</span>
                <span>{recipientEmail || <span className="text-gray-400">Not provided</span>}</span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(3)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
              {/* Delivery Date */}
              <div className="mb-2 flex items-center">
                <span className="font-semibold mr-2">Delivery Date:</span>
                <span>{deliveryDate || <span className="text-gray-400">Not provided</span>}</span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(4)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
              {/* Delivery Time */}
              <div className="mb-2 flex items-center">
                <span className="font-semibold mr-2">Delivery Time:</span>
                <span>{deliveryTime || <span className="text-gray-400">Not provided</span>}</span>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => setStep(4)}
                  title="Edit"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" onClick={() => setStep(4)} variant="secondary" disabled={isSubmitting}>Back</Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sealing...' : 'Seal Capsule'}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl text-center mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Your Time Capsule</h2>
      {/* Global error/success for page level if needed, or use a notification component */}
      <div className="p-6 border border-gray-200 rounded-lg text-left">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CapsuleCreatorPage;