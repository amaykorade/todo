import React from 'react';

export const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>{children}</div>
);

export const CardContent = ({ children }) => <div>{children}</div>;
export const CardHeader = ({ children }) => <div>{children}</div>;
export const CardTitle = ({ children }) => <h3>{children}</h3>;
