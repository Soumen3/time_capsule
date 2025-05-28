// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button'; // Adjust path if needed

import HeroTimeCapsule from '../assets/illustrations/hero-time-capsule.svg'; // Adjust path if needed
import MainLayout from '../components/Layout/MainLayout';
import authService from '../services/auth'; // Add this import
// Add floating animation keyframes
const floatingCapsuleStyle = `
@keyframes float {
  0% { transform: translateY(0);}
  50% { transform: translateY(-18px);}
  100% { transform: translateY(0);}
}
.floating-capsule {
  animation: float 3s ease-in-out infinite;
}
`;

const LandingPage = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    })();
  }, []);

  return (
    <MainLayout>
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      {/* Inject floating animation style */}
      <style>{floatingCapsuleStyle}</style>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Your Digital Time Capsule for Future Generations
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Preserve precious moments, heartfelt messages, and significant memories.
              Schedule them to unlock and deliver at precise moments in the future,
              connecting you with tomorrow, today.
            </p>
            {/* Only show buttons if user is NOT logged in */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="primary" className="w-full sm:w-auto px-6 py-3 text-lg">
                    Get Started - It's Free!
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full sm:w-auto px-6 py-3 text-lg">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            {/* Hero SVG Time Capsule illustration with floating animation */}
            <div className="floating-capsule w-40 h-auto md:w-48 flex items-center justify-center">
              <img
                src={HeroTimeCapsule}
                alt="Time Capsule Illustration"
                className="w-full h-auto select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-4">1</div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Create Your Capsule</h3>
              <p className="text-gray-600">Add text, photos, videos, and documents to your digital time capsule.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-4">2</div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Set Delivery Details</h3>
              <p className="text-gray-600">Choose a specific date, time, and recipients for your capsule's delivery.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-4">3</div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Receive in the Future</h3>
              <p className="text-gray-600">On the scheduled date, the capsule unlocks, delivering your memories.</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section (Expanded Features) */}
        <section className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Time Capsule?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-blue-600 mb-2">Unmatched Reliability</h3>
              <p className="text-gray-600">Your memories are stored securely with redundant backups, ensuring they reach their destination decades from now.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-blue-600 mb-2">Future-Proof Formats</h3>
              <p className="text-gray-600">We handle format compatibility, so your photos and videos will be viewable no matter how technology evolves.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-blue-600 mb-2">Flexible Delivery</h3>
              <p className="text-gray-600">Email, in-app notifications, and even future physical integrations to ensure your message gets through.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-blue-600 mb-2">Private & Collaborative</h3>
              <p className="text-gray-600">Keep capsules private, share with specific loved ones, or create collaborative group memories.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full max-w-4xl bg-blue-600 text-white p-8 rounded-xl shadow-2xl mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Preserve Your Legacy?</h2>
          <p className="text-lg mb-8">Start creating your first digital time capsule today. It's simple, secure, and meaningful.</p>
          <Link to="/register">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Create Your First Capsule Now!
            </Button>
          </Link>
        </section>
      </main>

    </div>
    </MainLayout>
  );
};

export default LandingPage;
