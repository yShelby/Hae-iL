import React, {useEffect, useState} from 'react';
import MyRecordStatus from "@features/dashboard/MyRecordStatus.jsx";
import DailyMission from "@features/dashboard/DailyMission.jsx";
import "./css/DashboardPage.css";
import TodayQuestion from "@features/dashboard/TodayQuestion.jsx";
import WordCloud from "@features/dashboard/WordCloud.jsx";

const DashboardPage = () => {

    // 워드 클라우드 데이터 상태 관리
    // - 페이지 레벨에서 비동기 데이터를 관리하고,
    // - UI 컴포넌트(WordCloud)에는 데이터만 전달하는 것이 FSD 구조에 더 적합
    const [wordData, setWordData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 백엔드 API 호출을 시뮬레이션하는 로직
        // 추후 실제 API (예: fetch('/api/dashboard/wordcloud'))로 교체 필요
        const timer = setTimeout(() => {
            // 테스트용 Mock Data (API 응답이라고 가정)
            const mockWords = [
                { text: '행복', value: 65, sentiment: 'positive' },
                { text: '기쁨', value: 50, sentiment: 'positive' },
                { text: '설렘', value: 35, sentiment: 'positive' },
                { text: '우울', value: 60, sentiment: 'negative' },
                { text: '슬픔', value: 48, sentiment: 'negative' },
                { text: '불안', value: 30, sentiment: 'negative' },
                { text: '일상', value: 20, sentiment: 'neutral' },
            ];
            setWordData(mockWords);
            setIsLoading(false);
        }, 1500); // 1.5초 후 데이터 로드 완료

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []); // 최초 렌더링 시 한 번만 실행

    return (
        // 이 내용은 DashboardLayout의 <Outlet /> 안으로 렌더링됩니다.
        <>
            <div className="horizontal-container">
                <div style={{flex: 2}}>
                    <MyRecordStatus/>
                </div>
                <div className="placeholder-box"
                     style={{flex: 1, padding: 0, alignItems: 'stretch', justifyContent: 'stretch'}}>
                    <TodayQuestion />
                </div>
            </div>
            <div className="horizontal-container" style={{flexGrow: 1}}>
                <div className="placeholder-box wordcloud-container" style={{flex: 1}}>
                    <h3 className="title">나의 감정 키워드</h3>
                    <WordCloud words={wordData} isLoading={isLoading} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* DailyMission 컨테이너에서 flex: 1을 제거하여 내용에 따라 높이가 결정되도록 수정 */}
                    <div className="placeholder-box" style={{ padding: 0, alignItems: 'stretch', justifyContent: 'stretch', marginBottom: '1rem' }}>
                        <DailyMission/>
                    </div>
                    <div className="placeholder-box" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>???</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;