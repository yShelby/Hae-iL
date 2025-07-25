import React from 'react';
import './Card.css';

const Card = ({ title, content, children }) => {
    return (
        <div className="card">
            {title && <h3 className="card-title">{title}</h3>}
            {content && <p className="card-content">{content}</p>}
            {children}
        </div>
    );
};

export default Card;
