import React from 'react';
import "./css/DashboardLayout.css";
import Weather from "@features/dashboard/Weather.jsx";
import {Outlet} from "react-router-dom";

const DashboardLayout = () => {
    return (
        <main className="dashboard-container">
            {/* --- ⬇️ 좌측 컬럼 (내용이 바뀌는 영역) ⬇️ --- */}
            <div className="dashboard-left-column">
                <Outlet/>
            </div>

            {/* --- ⬇️ 우측 컬럼 (공통 영역) ⬇️ --- */}
            <div className="dashboard-right-column">
                <div className="placeholder-box">
                    {/* "위치 정보 요청 → 백엔드 API 호출 → 외부 API 호출 → 응답"
                    과정을 거치기 때문에 1~2초 정도의 로딩이 걸린다.(정상) */}
                    <Weather/>
                </div>
                <div className="placeholder-box" style={{height: '80px'}}>포춘쿠키 (영역)</div>
                <div className="placeholder-box" style={{height: '120px'}}>오늘의 질문 (영역)</div>
                <div className="placeholder-box" style={{flexGrow: 1}}>달력 (영역)</div>
            </div>
        </main>
    );
};

export default DashboardLayout;
