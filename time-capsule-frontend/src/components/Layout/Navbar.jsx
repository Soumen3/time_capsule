// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import Button from '../Button';

/**
 * Navbar component with modern design and color schemes.
 * Features gradient backgrounds, glass morphism effects, and smooth animations.
 */
const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    navigate('/login');
  };

  return (
    <nav className="relative w-full max-w-7xl mx-auto mt-4">
      {/* Gradient Background with Glass Effect */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center">
          
          {/* Brand/Logo Section */}
          <Link 
            to="/" 
            className="group flex items-center space-x-3 mb-6 md:mb-0"
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

          {/* Navigation Section */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
            {user ? (
              // Authenticated User Interface
              <>
                {/* Welcome Message */}
                <div className="text-center md:text-left">
                  <div className="text-white/90 font-medium text-sm mb-1">Welcome back!</div>
                  <div className="text-yellow-200 font-semibold text-lg">{user.name}</div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                  <Link to="/dashboard" className="w-full md:w-auto">
                    <Button
                      className="w-full md:w-auto px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                      variant="secondary"
                    >
                      📊 Dashboard
                    </Button>
                  </Link>
                  
                  <Link to="/create-capsule" className="w-full md:w-auto">
                    <Button
                      className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      variant="primary"
                    >
                      ✨ Create Capsule
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={handleLogout}
                    className="w-full md:w-auto px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white font-medium rounded-xl border border-red-400/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                    variant="danger"
                  >
                    🚪 Logout
                  </Button>
                </div>
              </>
            ) : (
              // Guest User Interface
              <>
                <div className="text-white/80 text-center mb-2 md:mb-0 md:mr-4">
                  <span className="text-lg font-medium">Join the journey</span>
                </div>
                
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                  <Link to="/login" className="w-full md:w-auto">
                    <Button
                      className="w-full md:w-auto px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
                      variant="secondary"
                    >
                      🔑 Login
                    </Button>
                  </Link>
                  
                  <Link to="/register" className="w-full md:w-auto">
                    <Button
                      className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      variant="primary"
                    >
                      🌟 Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 -z-10"></div>
    </nav>
  );
};

export default Navbar;