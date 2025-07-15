import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const WordCloudEmptyState = ({ onRefresh, isLoading }) => {
    return (
        <div className="wordcloud-message-container">
            <div className="wordcloud-message">표시할 데이터가 없습니다.</div>
            <button
                onClick={onRefresh}
                className="refresh-button"
                title="새로고침"
                disabled={isLoading}
            >
                <FaSyncAlt />
            </button>
        </div>
    );
};

export default WordCloudEmptyState;