import React from "react";
import "./css/Button.css";

export const Button = ({children, active, ...props}) => {
    const buttonClassName = `btn ${active ? 'active' : ''}`;

    return (
        <button className={buttonClassName.trim()} {...props}>
            {children}
        </button>
    )
}