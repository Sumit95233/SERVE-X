import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-[#07549A]/20 border-t-[#07549A] rounded-full animate-spin`}
      />
      {message && <p className="text-xs font-medium text-[#64748B]">{message}</p>}
    </div>
  );
};
