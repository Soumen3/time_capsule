import React from 'react';
import './LoadingSpinner.css'; // Import the CSS file

const LoadingSpinner = ({ size = 'h-12 w-12', color = 'text-indigo-600' }) => {
  return (
    <>  
        <div className="loader"> {/* Changed class to className for React */}
            <span className="loader-text">loading</span> {/* Changed class to className */}
            <span className="load"></span> {/* Changed class to className */}
        </div>
    </>
  );
};

export default LoadingSpinner;
