import React from 'react';

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`btn btn-primary w-100 mb-3 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
