import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizes[size]} ${colors[color]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
