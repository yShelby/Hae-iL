import React from 'react';
import './css/EmtionResult.css'
import EmotionTags from "@features/emotions/EmotionsTags.jsx";

export default function EmotionResult({ result }) {
    const { details, mood_score, tags } = result;

    return (
        <div>
            <h2>감정 분석 결과</h2>

            <div className="mood-score">
                감정 점수: <strong>{mood_score}</strong>점
            </div>

            <div className="emotion-details">
                <h3>감정 분포</h3>
                <ul className="emotion-bars">
                    {details.map((emotion, index) => (
                        <li key={index} className="emotion-bar-item">
                            <span className="emotion-label">{emotion.emotion_type}</span>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${emotion.percentage}%`,
                                        backgroundColor: getColorForEmotion(emotion.emotion_type),
                                    }}
                                ></div>
                                <span className="progress-percent">{emotion.percentage}%</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <EmotionTags tags={tags} />
        </div>
    );
}

// 감정에 따른 색상 맵핑 함수
const getColorForEmotion = (type) => {
    switch (type) {
        case '기쁨': return '#fbc02d';
        case '분노': return '#e53935';
        case '슬픔': return '#1e88e5';
        case '불안': return '#8e24aa';
        case '놀람': return '#43a047';
        default: return '#90a4ae';
    }
};