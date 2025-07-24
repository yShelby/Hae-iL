import React, {useState, useEffect, useRef, useCallback} from 'react';
import './css/WordCloudComp.css';
import {FaSyncAlt} from "react-icons/fa";
import WordCloudEmptyState from "@features/dashboard/WordCloudEmptyState.jsx";
import WordCloudCanvas from "@features/dashboard/WordCloudCanvas.jsx";
import {fetchWordCloudData} from "@api/wordCloudApi.js";

const WordCloudComp = (
    // {words, isLoading, isRefreshing, onRefresh}
) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    // [추가] 컴포넌트 내부에서 상태를 직접 관리
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // [추가] 데이터 로딩 및 가공을 책임지는 함수
    const loadData = useCallback(async () => {
        // API 응답 형식: [{ text: "행복", value: 10, sentiment: null }, ...]
        const apiData = await fetchWordCloudData();

        // wordcloud2.js 라이브러리는 [['단어', 빈도수], ['단어2', 빈도수2]] 형태의 2차원 배열을 요구
        // 따라서, 백엔드에서 받은 객체 배열을 이에 맞게 변환해주는 과정이 필요
        if (apiData && Array.isArray(apiData)) {
            const formattedWords = apiData.map(item => [item.text, item.value]);
            setWords(formattedWords);
        } else {
            setWords([]);
        }
    }, []);

    // [추가] 새로고침 버튼 클릭 시 실행될 함수
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await loadData();
        // 애니메이션 효과를 위해 잠시 지연 후 false로 변경
        setTimeout(() => setIsRefreshing(false), 500);
    }, [loadData]);

    // [수정] 컴포넌트가 처음 마운트될 때 데이터를 불러온다.
    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);
            await loadData();
            setIsLoading(false);
        };
        initialLoad();
    }, [loadData]);
    
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
    }, [isLoading]); // isLoading이 변경될 때마다 이 로직을 재실행

    if (isLoading) {
        return <div className="wordcloud-message">로딩 중...</div>;
    }

    if (!words || words.length === 0) {
        return (
            <div className="wordcloud-container-with-button">
                <div className="wordcloud-display-area">
                    <WordCloudEmptyState/>
                </div>
                <button
                    className="refresh-button" title="새로고침"
                    // onClick={onRefresh}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
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
                // onClick={onRefresh}
                onClick={handleRefresh}
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
