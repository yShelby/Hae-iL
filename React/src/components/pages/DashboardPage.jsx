import React, {useEffect, useState} from 'react';
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

    // 데이터 로딩 로직을 페이지 컴포넌트로 가져온다.
    useEffect(() => {
        if (!user || !user.id) {
            setIsLoading(false);
            setWordData([]);
            return;
        }

        const loadData = async () => {
            if (refreshKey > 0) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            try {
                // test db 사용으로 변경 - 추후 실제 mood db로 변경 필요
                const data = await fetchTestEmotionData();
                setWordData(data || []);
            } catch (error) {
                console.error("DashboardPage에서 워드클라우드 데이터를 가져오는 데 실패했습니다.", error);
                setWordData([]);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        };

        loadData();
    }, [user?.id, refreshKey]);

    // 새로고침 핸들러 함수
    const handleRefresh = () => {
        if (!isRefreshing) {
            setRefreshKey(prev => prev + 1);
        }
    };

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
                <div className="placeholder-box wordcloud-container" style={{flex: 1}}>
                    <h3 className="title">나의 감정 키워드</h3>
                    <WordCloudComp
                        words={wordData} isLoading={isLoading}
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