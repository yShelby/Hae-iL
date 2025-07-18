import React, {useState, useEffect, useCallback, useRef} from 'react';
import './css/WordCloudComp.css';
import {fetchWordCloudData} from "@api/wordCloudApi.js"; // 워드 클라우드 전용 CSS 파일
import {FaSyncAlt} from "react-icons/fa";
import WordCloudEmptyState from "@features/dashboard/WordCloudEmptyState.jsx";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import CustomWordCloud from "@features/dashboard/CustomWordCloud.jsx";

/*
 * - 씨앗 기반(Seeded) 난수 생성 함수
 * Math.random()은 호출할 때마다 다른 값을 반환하여 라이브러리 레이아웃 계산에 혼란을 준다
 * 이 함수는 단어 텍스트(씨앗)가 같으면 언제나 동일한 소수(0과 1 사이)를 반환하여,
 * 각 단어의 회전 각도를 고정시키고 렌더링을 안정화시키는 핵심적인 역할 수행
 */
const getDeterministicRandom = (seedText, seedNum) => {
    const combinedSeed = seedText + seedNum;
    let hash = 0;
    for (let i = 0; i < combinedSeed.length; i++) {
        const char = combinedSeed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // 32비트 정수로 변환
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
};

const WordCloud = () => {
    const {user, loading: authLoading} = useAuth();
    const checkLogin = useCheckLogin();
    const [wordData, setWordData] = useState([]);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // 워드클라우드를 그릴 부모 컨테이너의 크기를 동적으로 감지하기 위해 useRef를 사용
    // 이를 통해 화면 크기가 변경되어도 워드클라우드가 깨지지 않고 자동으로 리사이징되는
    // 반응형 디자인을 구현 가능
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    const handleRefresh = () => {
        // 1. 먼저 로그인 상태를 확인
        const isLoggedIn = checkLogin();
        // 2. 로그인 상태일 때만 데이터 새로고침을 실행
        if (isLoggedIn && !isRefreshing) { // 로딩 중일 때 중복 클릭 방지
            setRefreshKey(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (!user) {
            setIsInitialLoading(false);
            setIsRefreshing(false);
            setWordData([]); // 혹시 모를 데이터 잔여물 제거
            return;
        }

        const loadData = async () => {
            // refreshKey가 0일 때(최초 로드)가 아니면 isRefreshing을 true로 설정
            if (refreshKey > 0) {
                setIsRefreshing(true);
            } else {
                // user 객체가 들어온 직후, 최초 로딩 상태를 true로 확실하게 설정
                setIsInitialLoading(true);
            }
            try {
                const data = await fetchWordCloudData();
                setWordData(data);
            } catch (error) {
                console.error("WordCloud 컴포넌트에서 데이터를 가져오는 데 실패했습니다.", error);
                setWordData([]);
            } finally {
                setIsInitialLoading(false);
                setIsRefreshing(false);
            }
        };
        loadData();
    }, [refreshKey, user]);

    // 컨테이너의 크기가 변경될 때마다 dimensions state를 업데이트하여
    // CustomWordCloud 컴포넌트에 새로운 크기를 전달하고 리렌더링을 유발
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions(); // 초기 사이즈 설정
        window.addEventListener('resize', updateDimensions); // 창 크기 변경 감지
        return () => window.removeEventListener('resize', updateDimensions);
    }, []); // 컴포넌트 마운트 시 한 번만 실행


    // --- d3-cloud를 위한 헬퍼 함수 ---
    // 1. 폰트 크기 계산 함수: value(빈도수)를 실제 폰트 크기(px)로 변환
    const fontSizeMapper = (word) => {
        const values = wordData.map(w => w.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const minFont = 15, maxFont = 90;
        if (maxValue === minValue) return minFont;
        return minFont + ((Number(word.value) - minValue) / (maxValue - minValue)) * (maxFont - minFont);
    };

    // 2. 색상 결정 함수: sentiment 값에 따라 색상을 반환
    const sentimentColorizer = (word) => {
        // 1. 감성에 따라 기본 색상(Hue) 결정
        let hue;
        switch (word.sentiment) {
            case 'positive':
                hue = 210;
                break; // 파란색 계열
            case 'negative':
                hue = 0;
                break; // 붉은색 계열
            default:
                hue = 140;
                break; // 초록색 계열
        }

        // 2. value 값에 따라 명도(Lightness) 계산
        const values = wordData.map(w => Number(w.value));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const minLightness = 75; // 연한 색 (밝기 75%)
        const maxLightness = 30; // 진한 색 (밝기 30%)

        let lightness = minLightness;
        if (maxValue > minValue) {
            // value가 클수록 maxLightness(진한 색)에 가까워지도록 계산
            const ratio = (Number(word.value) - minValue) / (maxValue - minValue);
            lightness = minLightness - (ratio * (minLightness - maxLightness));
        }

        // 3. 최종 HSL 색상 문자열 반환
        return `hsl(${hue}, 80%, ${lightness}%)`;
    };

    // react-d3-cloud 에서는 디폴트로 -90도 ~ 90도 회전이 설정되어 있기 때문에 주석 처리
    // 단어 회전(각도)을 위한 함수(-90도 ~ 90도)
    // const rotate = () => Math.random() * 180 - 90;

    /**
     * 단어 회전(각도) 결정 함수
     * - 빈도수가 높은 (크기가 큰) 단어는 0도로 고정하여 수평으로 표시
     * - 나머지 작은 단어들은 0도(수평) 또는 90도(수직)로만 무작위 회전
     */
    const rotate = useCallback((word) => {
        // 큰 텍스트의 기준을 정의(예: 최대 빈도수의 60% 이상)
        const values = wordData.map(w => w.value);
        const maxValue = Math.max(...values);
        const BIG_WORD_THRESHOLD = maxValue * 0.6; // 이 값은 데이터 분포에 따라 조절 가능

        // 기준보다 큰 단어는 0도로 고정
        if (word.value >= BIG_WORD_THRESHOLD) {
            return 0;
        }

        // 작은 단어는 0도 또는 90도로만 무작위 회전
        const deterministicRandomValue = getDeterministicRandom(word.text, refreshKey);
        return deterministicRandomValue > 0.5 ? 90 : 0;

    }, [wordData, refreshKey]); // wordData가 의존성 배열에 추가되어야 동적으로 기준을 계산 가능

    // --- 렌더링 로직 ---
    // 1. Auth 정보 로딩 중일 때 (가장 우선)
    if (authLoading) {
        return <div className="wordcloud-message">인증 정보 확인 중...</div>;
    }

    // 2. 비로그인 시에는 "데이터 없음" 상태를 보여준다
    if (!user) {
        // 데이터가 없는 경우와 레이아웃을 통일하고, 새로고침 버튼을 일관되게 표시하기 위해
        // WordCloudEmptyState를 직접 사용하는 대신 아래의 JSX 구조를 사용
        return (
            <div className="wordcloud-container-with-button">
                <div className="wordcloud-display-area">
                    <WordCloudEmptyState />
                </div>
                <button onClick={handleRefresh} className="refresh-button" title="새로고침" disabled={isRefreshing}>
                    <FaSyncAlt className={isRefreshing ? 'spin' : ''}/>
                </button>
            </div>
        );
    }

    // 3. 로그인 상태 & '최초' 로딩 시에만 "로딩 중..." 메시지를 보여준다
    if (isInitialLoading) {
        return <div className="wordcloud-message">로딩 중...</div>;
    }

    // 4. 로딩이 끝났지만 표시할 데이터가 없을 때 (서버 응답이 빈 배열)
    if (wordData.length === 0) {
        return <WordCloudEmptyState onRefresh={handleRefresh} isLoading={isRefreshing}/>;
    }

    return (
        <div className="wordcloud-container-with-button">
            {/* ref를 이 div에 연결하여 동적으로 너비와 높이를 측정
                이 div의 크기가 곧 워드클라우드가 그려질 캔버스의 크기가 된다. */}
            <div ref={containerRef} className="wordcloud-display-area">
                {/* 측정된 dimensions가 유효할 때(너비와 높이가 0이 아닐 때)만
                    CustomWordCloud를 렌더링하여 불필요한 계산을 방지 */}
                {dimensions.width > 0 && dimensions.height > 0 && (
                    <CustomWordCloud
                        data={wordData}
                        width={dimensions.width}
                        height={dimensions.height}
                        fontFamily="Noto Sans KR, Malgun Gothic, sans-serif"
                        padding={5}
                        fontSizeMapper={fontSizeMapper}
                        sentimentColorizer={sentimentColorizer}
                        rotate={rotate}
                    />
                )}
            </div>
            {/* 로그인한 사용자에게는 항상 새로고침 버튼이 보이도록 바깥으로 이동시킨다.
                이렇게 하면 데이터가 있든 없든 일관된 UI를 제공 가능 */}
            {user && (
                <button
                    onClick={handleRefresh}
                    className="refresh-button"
                    title="새로고침"
                    disabled={isRefreshing}
                >
                    <FaSyncAlt className={isRefreshing ? 'spin' : ''}/>
                </button>
            )}
        </div>
    );
};

export default WordCloud;