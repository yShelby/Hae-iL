import React from 'react';
import './Input.css';

const Input = ({ placeholder, value, onChange, ...props }) => {
    return (
        <input
            className="input"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
};

export default Input;
