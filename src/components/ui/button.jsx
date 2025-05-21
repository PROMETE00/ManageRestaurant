// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md  hover:bg-yellow-400 text-black font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
