import React, {useEffect, useMemo, useState} from 'react';
import MyRecordStatus from "@features/dashboard/MyRecordStatus.jsx";
import DailyMission from "@features/dashboard/DailyMission.jsx";
import "./css/DashboardPage.css";
import TodayQuestion from "@features/dashboard/TodayQuestion.jsx";
import WordCloudComp from "@features/dashboard/WordCloudComp.jsx";
import {fetchTestEmotionData} from "@api/wordCloudApi.js";
import {useAuth} from "@shared/context/AuthContext.jsx";

const DashboardPage = () => {
    // 페이지 레벨에서 사용자 정보 및 워드클라우드 관련 모든 상태를 관리
    const {user} = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    // 워드 클라우드 데이터 상태 관리
    // - 페이지 레벨에서 비동기 데이터를 관리하고,
    // - UI 컴포넌트(WordCloudComp)에는 데이터만 전달하는 것이 FSD 구조에 더 적합
    const [wordData, setWordData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // [수정] user?.id와 refreshKey 의존성 분리
    // 1. 초기 데이터 로딩을 위한 useEffect
    useEffect(() => {
        if (!user || !user.id) {
            setIsLoading(false);
            setWordData([]);
            return;
        }

        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTestEmotionData();
                setWordData(data || []);
            } catch (error) {
                console.error("DashboardPage에서 초기 워드클라우드 데이터를 가져오는 데 실패했습니다.", error);
                setWordData([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [user?.id]); // 오직 user.id에만 의존

    // 2. '새로고침' 액션을 위한 useEffect
    useEffect(() => {
        // 맨 처음(refreshKey가 0)에는 실행되지 않도록 방지합니다.
        if (refreshKey === 0) return;

        const refreshData = async () => {
            setIsRefreshing(true);
            try {
                const data = await fetchTestEmotionData();
                setWordData(data || []);
            } catch (error) {
                console.error("DashboardPage에서 워드클라우드 데이터를 새로고침하는 데 실패했습니다.", error);
            } finally {
                setIsRefreshing(false);
            }
        };

        refreshData();
    }, [refreshKey]); // 오직 refreshKey에만 의존

    // 새로고침 핸들러 함수
    const handleRefresh = () => {
        if (!isRefreshing) {
            setRefreshKey(prev => prev + 1);
        }
    };

    // [추가] wordcloud2.js가 요구하는 형식으로 데이터를 변환
    // useMemo를 사용하여 wordData가 변경될 때만 이 변환 작업을 수행하여 성능을 최적화
    const formattedWords = useMemo(() => {
        if (!wordData || wordData.length === 0) return [];
        // wordcloud2.js 라이브러리에 전달하기 전에 데이터의 유효성을 검사하여 런타임 에러를 방지합
        // 1. filter: 'text'가 있고 'value'가 유효한 숫자인 데이터만 남긴다.
        // 2. map: 유효성이 검증된 안전한 데이터를 [단어, 가중치] 형태로 변환합
        return wordData
            .filter(d => d.text && typeof d.value === 'number' && !isNaN(d.value))
            .map(d => [d.text, d.value]);
    }, [wordData]);

    return (
        // 이 내용은 DashboardLayout의 <Outlet /> 안으로 렌더링된다.
        <>
            <div className="horizontal-container">
                <div style={{flex: 2}}>
                    <MyRecordStatus/>
                </div>
                <div className="placeholder-box"
                     style={{flex: 1, padding: 0, alignItems: 'stretch', justifyContent: 'stretch'}}>
                    <TodayQuestion/>
                </div>
            </div>
            <div className="horizontal-container" style={{flexGrow: 1}}>
                <div className="placeholder-box wordcloud-container" style={{flex: 2}}>
                    <h3 className="title">나의 감정 키워드</h3>
                    <WordCloudComp
                        key={refreshKey} // [추가] 애니메이션 key 전달
                        words={formattedWords} // [수정] 변환된 데이터를 props로 전달
                        isLoading={isLoading}
                        isRefreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                </div>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    {/* DailyMission 컨테이너에서 flex: 1을 제거하여 내용에 따라 높이가 결정되도록 수정 */}
                    <div className="placeholder-box"
                         style={{padding: 0, alignItems: 'stretch', justifyContent: 'stretch', marginBottom: '1rem'}}>
                        <DailyMission/>
                    </div>
                    <div className="placeholder-box"
                         style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span>???</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;