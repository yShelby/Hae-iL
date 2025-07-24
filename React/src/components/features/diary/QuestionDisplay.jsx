import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import './css/QuestionDisplay.css';
import {useQuestion} from "@shared/context/QuestionContext.jsx";

const QuestionDisplay = ({ question }) => {

    const {isLoading, refreshQuestion} = useQuestion();

    // 새로운 질문을 가져오는 함수
    const handleRefresh = (e) => {
        e.stopPropagation();
        refreshQuestion(); // Context의 함수를 직접 호출
    };

    // 질문이 없으면 아무것도 렌더링 x
    if (!question) {
        return null;
    }

    return (
        <div className="question-display-container">
            <span className="question-label">오늘의 질문</span>
            <p className="question-text-in-diary">{question}</p>
            <button
                onClick={handleRefresh}
                className="btn-refresh-in-diary"
                title="다른 질문 보기"
                disabled={isLoading}
            >
                <FaSyncAlt className={isLoading ? 'rotating' : ''} />
            </button>
        </div>
    );
};

export default QuestionDisplay;
