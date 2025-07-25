import React from 'react';
import './Button.css';

export default function Button({ children, variant = "default", icon }) {
    return (
        <button className={`button ${variant}`}>
            {icon && React.createElement(icon, { className: "button-icon" })}
            {children}
        </button>
    );
}
