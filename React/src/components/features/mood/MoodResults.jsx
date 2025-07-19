import React from 'react';
import './css/MoodResult.css'
import MoodTags from "@features/mood/MoodTags.jsx";

export default function MoodResult({ result }) {
    const { details, mood_score, tags } = result;

    return (
        <div>
            <h2>감정 분석 결과</h2>

            <div className="mood-score">
                감정 점수: <strong>{mood_score}</strong>점
            </div>

            <div className="mood-details">
                <h3>감정 분포</h3>
                <ul className="mood-bars">
                    {details.map((mood, index) => (
                        <li key={index} className="mood-bar-item">
                            <span className="mood-label">{mood.mood_type}</span>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${mood.percentage}%`,
                                        backgroundColor: getColorForMood(mood.mood_type),
                                    }}
                                ></div>
                                <span className="progress-percent">{mood.percentage}%</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <MoodTags tags={tags} />
        </div>
    );
}

// 감정에 따른 색상 맵핑 함수
const getColorForMood = (type) => {
    switch (type) {
        case '기쁨': return '#fbc02d';
        case '분노': return '#e53935';
        case '슬픔': return '#1e88e5';
        case '불안': return '#8e24aa';
        case '놀람': return '#43a047';
        default: return '#90a4ae';
    }
};