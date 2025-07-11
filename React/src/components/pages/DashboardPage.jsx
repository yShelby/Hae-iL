import React from 'react';
import MyRecordStatus from "@features/dashboard/MyRecordStatus.jsx";

const DashboardPage = () => {
    return (
        // 이 내용은 DashboardLayout의 <Outlet /> 안으로 렌더링됩니다.
        <>
            <MyRecordStatus/>
            <div className="placeholder-box" style={{height: '250px'}}>
                오늘 감정 분석 / 최근 자가 진단 결과 (영역)
            </div>
            <div className="placeholder-box" style={{height: '150px'}}>
                중요한 일 / to do (영역)
            </div>
        </>
    );
};

export default DashboardPage;