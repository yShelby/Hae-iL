import React, {useState, useEffect, useRef} from 'react';
import './css/WordCloudComp.css';
import {FaSyncAlt} from "react-icons/fa";
import WordCloudEmptyState from "@features/dashboard/WordCloudEmptyState.jsx";
import CustomWordCloud from "@features/dashboard/CustomWordCloud.jsx";

const WordCloudComp = ({words, isLoading, isRefreshing, onRefresh}) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('layoutAnimationComplete', updateDimensions);
        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('layoutAnimationComplete', updateDimensions);
            window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    if (isLoading) {
        return <div className="wordcloud-message">로딩 중...</div>;
    }

    if (!words || words.length === 0) {
        return (
            <div className="wordcloud-container-with-button">
                <div className="wordcloud-display-area">
                    <WordCloudEmptyState/>
                </div>
                <button onClick={onRefresh} className="refresh-button" title="새로고침" disabled={isRefreshing}>
                    <FaSyncAlt className={isRefreshing ? 'spin' : ''}/>
                </button>
            </div>
        );
    }

    return (
        <div className="wordcloud-container-with-button">
            <div ref={containerRef} className="wordcloud-display-area">
                {dimensions.width > 0 && dimensions.height > 0 && (
                    <CustomWordCloud
                        words={words}
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                )}
            </div>
            <button
                onClick={onRefresh}
                className="refresh-button"
                title="새로고침"
                disabled={isRefreshing}
            >
                <FaSyncAlt className={isRefreshing ? 'spin' : ''}/>
            </button>
        </div>
    );
};

export default WordCloudComp;
