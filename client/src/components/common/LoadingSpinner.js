import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
