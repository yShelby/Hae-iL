import React from 'react';
import MyRecordStatus from "@features/dashboard/MyRecordStatus.jsx";
import DailyMission from "@features/dashboard/DailyMission.jsx";
import "./css/DashboardPage.css";
import TodayQuestion from "@features/dashboard/TodayQuestion.jsx";

const DashboardPage = () => {
    return (
        // 이 내용은 DashboardLayout의 <Outlet /> 안으로 렌더링됩니다.
        <>
            <div className="horizontal-container">
                <div style={{flex: 2}}>
                    <MyRecordStatus/>
                </div>
                <div className="placeholder-box"
                     style={{flex: 1, padding: 0, alignItems: 'stretch', justifyContent: 'stretch'}}>
                    <DailyMission/>
                </div>
            </div>
            <div className="horizontal-container" style={{flexGrow: 1}}>
                <div className="placeholder-box" style={{flex: 1}}>
                    오늘 감정 분석 / 최근 자가 진단 결과 (영역)
                </div>
                <div className="placeholder-box" style={{flex: 1, padding: 0, alignItems: 'stretch', justifyContent: 'stretch'}}>
                    <TodayQuestion />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;