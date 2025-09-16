
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. text-blue-500
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-blue-600' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${color}`}
        style={{ borderTopColor: 'transparent' }} // Ensure transparent top for spinner effect
      ></div>
    </div>
  );
};

export default Spinner;
