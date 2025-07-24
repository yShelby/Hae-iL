import React from 'react';
import './css/MoodResult.css'

export default function MoodTags({ tags, scoreTagFade }) {
    if (!tags || tags.length === 0) {
        return <p className="no-tags">태그가 없습니다.</p>;
    }

    return (
        <div className="mood-tags-container">
            <h3>태그</h3>
            <div className={"tags-box"}>
                <ul className={`tags-list${scoreTagFade ? ' fade-in' : ''}`}>
                    {tags.map((tag, index) => (
                        <li key={index} className="tag-item">{tag}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}