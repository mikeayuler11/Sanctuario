import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-memorial flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cemetery-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">
          Sanctuario de Santa Rosa de Lima
        </h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;