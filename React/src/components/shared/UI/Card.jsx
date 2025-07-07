import React from "react";
import "./css/Card.css";

export const Card = ({children, ...props}) => {
    return (
        <div className={"card"} {...props}>
            {children}
        </div>
    )
}