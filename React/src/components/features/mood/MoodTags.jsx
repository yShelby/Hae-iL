import React from 'react';
import './css/MoodResult.css'

export default function MoodTags({ tags }) {
    if (!tags || tags.length === 0) {
        return <p className="no-tags">태그가 없습니다.</p>;
    }

    return (
        <div className="mood-tags-container">
            <h3>추천 태그</h3>
            <ul className="tags-list">
                {tags.map((tag, index) => (
                    <li key={index} className="tag-item">{tag}</li>
                ))}
            </ul>
        </div>
    );
}