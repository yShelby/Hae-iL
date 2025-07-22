import React, {useState, useEffect, useRef} from 'react';
import './css/WordCloudComp.css';
import {FaSyncAlt} from "react-icons/fa";
import WordCloudEmptyState from "@features/dashboard/WordCloudEmptyState.jsx";
import WordCloudCanvas from "@features/dashboard/WordCloudCanvas.jsx";

const WordCloudComp = ({words, isLoading, isRefreshing, onRefresh}) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        // isLoading이 false이고, containerRef가 존재할 때만 Observer를 설정
        if (!isLoading && containerRef.current) {
            const observer = new ResizeObserver(entries => {
                // entries[0]가 관찰 대상인 containerRef.current
                if (entries && entries.length > 0) {
                    const {width, height} = entries[0].contentRect;
                    // 크기가 유효할 때만 상태를 업데이트하여 불필요한 렌더링을 방지
                    if (width > 0 && height > 0) {
                        setDimensions({width, height});
                    }
                }
            });

            observer.observe(containerRef.current);

            // 컴포넌트가 언마운트되거나, useEffect가 다시 실행되기 전에 observer를 정리
            return () => {
                observer.disconnect();
            };
        }
    }, [isLoading]); //  isLoading이 변경될 때마다 이 로직을 재실행

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
                    <WordCloudCanvas
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
