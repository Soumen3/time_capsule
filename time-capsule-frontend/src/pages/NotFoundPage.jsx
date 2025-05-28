// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// The user has provided a new illustration path.
// Ensure you have an image at src/assets/illustrations/page-not-found.svg
// or replace it with a placeholder image URL if you don't have the asset.
import pageNotFoundIllustration from '../assets/illustrations/page-not-found.svg'; // Adjust path if needed

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4 font-inter rounded-lg shadow-2xl text-center">
      {/* Responsive Illustration Image - Centered on the page */}
      <img
        src={pageNotFoundIllustration}
        alt="Page Not Found Illustration"
        // Tailwind classes for responsiveness and centering
        className="w-fit sm:w-56 md:w-72 max-w-xs sm:max-w-sm md:max-w-md h-auto mb-6 object-contain mx-auto"
        // Fallback for image loading errors (optional, but good practice)
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Illustration+Missing'; }}
      />

      <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">404 Error</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Page Not Found</h2>
      <p className="text-lg text-white text-opacity-80 mb-8 max-w-md">
        Oops! It looks like the page you're trying to reach doesn't exist.
        Perhaps it's lost in the digital cosmos.
      </p>
      <Link
        to="/"
        className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-xl hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
