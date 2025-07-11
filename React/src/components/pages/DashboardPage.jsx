import React from 'react';
import MyRecordStatus from "@features/dashboard/MyRecordStatus.jsx";
import "../../layouts/css/DashboardLayout.css";

const DashboardPage = () => {
    return (
        // 이 내용은 DashboardLayout의 <Outlet /> 안으로 렌더링됩니다.
        <>
            <div className="horizontal-container">
                <MyRecordStatus/>
                <div className="placeholder-box" style={{ flex: 1 }}>
                    오늘의 질문 (영역)
                </div>
            </div>
            <div className="horizontal-container" style={{flexGrow: 1}}>
                <div className="placeholder-box" style={{ flex: 1}}>
                    오늘 감정 분석 / 최근 자가 진단 결과 (영역)
                </div>
                <div className="placeholder-box" style={{ flex: 1}}>
                    중요한 일 / to do (영역)
                </div>
            </div>
        </>
    );
};

export default DashboardPage;