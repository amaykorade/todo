import React from 'react';

export const Button = ({ children, className = '', ...props }) => (
    <button className={`btn ${className}`} {...props}>
        {children}
    </button>
);
