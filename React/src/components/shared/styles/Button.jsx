import React from 'react';
import './Button.css';

export default function Button({ children, variant = "default", icon, onClick, ...rest }) {
    return (
        <button className={`button ${variant}`}
                onClick={onClick}
                {...rest} // ← 기타 props 전달 (disabled 등)
        >
            {icon && React.createElement(icon, { className: "button-icon" })}
            {children}
        </button>
    );
}
