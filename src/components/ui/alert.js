import React from 'react';

export const Alert = ({ children, className = '' }) => (
    <div className={`alert ${className}`}>{children}</div>
);

export const AlertDescription = ({ children }) => <p>{children}</p>;
