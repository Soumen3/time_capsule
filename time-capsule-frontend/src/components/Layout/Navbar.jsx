// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import Button from '../Button';
import { useNotification as useToastNotification } from '../../hooks/useNotification'; // For toast messages
import NotificationIcon from '../Notification/NotificationIcon'; // Import the new icon

/**
 * Navbar component with modern design and color schemes.
 * Features gradient backgrounds, glass morphism effects, and smooth animations.
 */
const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { showNotification: showToast } = useToastNotification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    // getCurrentUser is async, so await its result
    (async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      // Optionally: console.log(currentUser);
    })();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    showToast('You have been logged out.', 'info');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative w-full max-w-7xl mx-auto mt-4">
      {/* Gradient Background with Glass Effect */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
        {/* Header Bar Content Area: Give this a higher z-index */}
        <div className="relative z-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
          
          {/* Brand/Logo Section & Mobile Welcome/Notification */}
          <div className="w-full md:w-auto flex justify-between items-center mb-4 md:mb-0">
            <Link 
              to="/" 
              className="group flex items-center space-x-3"
            >
              {/* Brand Text */}
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300">
                  Time Capsule
                </span>
                <span className="text-xs text-white/70 font-medium tracking-wide">
                  Preserve Your Memories
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button & User Info (if logged in) */}
            {user && (
              <div className="flex items-center md:hidden">
                {/* Mobile Menu Button first */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
                 {/* Notification Icon second, with margin */}
                <div className="ml-3"> 
                  <NotificationIcon />
                </div>
              </div>
            )}
             {!user && ( // Show hamburger for guest users on mobile too
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="ml-3 p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>


          {/* Desktop Navigation Section */}
          <div className="hidden md:flex md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto"> {/* Adjusted space-x for smaller buttons */}
            {user ? (
              // Authenticated User Interface - Desktop
              <>
                <div className="text-center md:text-left">
                  <div className="text-white/90 font-medium text-sm mb-1">Welcome back!</div>
                  <Link to="/profile" className="text-yellow-200 font-semibold text-lg hover:underline">{user.name || user.email}</Link>
                </div>
                <div className="ml-0 md:ml-2"> {/* Adjusted margin */}
                  <NotificationIcon />
                </div>
                <Link to="/dashboard" className="w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                    variant="secondary"
                  >
                    📊 Dashboard
                  </Button>
                </Link>
                <Link to="/create-capsule" className="w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    variant="primary"
                  >
                    ✨ Create Capsule
                  </Button>
                </Link>
                <Link to="/profile" className="w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                    variant="secondary" 
                  >
                    👤 Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="w-full md:w-auto px-4 py-2 text-sm bg-red-500/80 hover:bg-red-500 text-white font-medium rounded-xl border border-red-400/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                  variant="danger"
                >
                  🚪 Logout
                </Button>
              </>
            ) : (
              // Guest User Interface - Desktop
              <>
                <div className="text-white/80 text-center mb-2 md:mb-0 md:mr-4">
                  <span className="text-lg font-medium">Join the journey</span>
                </div>
                <Link to="/login" className="w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                    variant="secondary"
                  >
                    🔑 Login
                  </Button>
                </Link>
                <Link to="/register" className="w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto px-4 py-2 text-sm bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    variant="primary"
                  >
                    🌟 Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown: Give this a lower z-index than the header bar but still high enough to be over page content */}
        {isMobileMenuOpen && (
          <div className="relative z-10 md:hidden bg-white/10 backdrop-blur-md rounded-b-2xl p-4" id="mobile-menu">
            <div className="flex flex-col space-y-2"> {/* Adjusted space-y for smaller buttons */}
              {user ? (
                <>
                  <div className="text-center mb-2">
                    <div className="text-white/90 font-medium text-sm">Welcome back!</div>
                    <Link to="/profile" className="text-yellow-200 font-semibold text-lg hover:underline" onClick={() => setIsMobileMenuOpen(false)}>{user.name || user.email}</Link>
                  </div>
                  <Link to="/profile" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30"
                      variant="secondary"
                    >
                      👤 Profile
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30"
                      variant="secondary"
                    >
                      📊 Dashboard
                    </Button>
                  </Link>
                  <Link to="/create-capsule" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg"
                      variant="primary"
                    >
                      ✨ Create Capsule
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-2 text-sm bg-red-500/80 hover:bg-red-500 text-white font-medium rounded-xl border border-red-400/50"
                    variant="danger"
                  >
                    🚪 Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30"
                      variant="secondary"
                    >
                      🔑 Login
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg"
                      variant="primary"
                    >
                      🌟 Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 -z-10"></div>
    </nav>
  );
};

export default Navbar;