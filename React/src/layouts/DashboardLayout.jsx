import React from 'react';
import "./css/DashboardLayout.css";
import Weather from "@features/dashboard/Weather.jsx";
import {Outlet} from "react-router-dom";
import FortuneCookie from "@features/dashboard/FortuneCookie.jsx";

const DashboardLayout = () => {
    return (
        <main className="dashboard-container">
            {/* --- ⬇️ 좌측 컬럼 ⬇️ --- */}
            <div className="dashboard-left-column">
                <Outlet/>
            </div>

            {/* --- ⬇️ 우측 컬럼 ⬇️ --- */}
            <div className="dashboard-right-column">
                <div className="horizontal-container">
                    {/* "위치 정보 요청 → 백엔드 API 호출 → 외부 API 호출 → 응답"
                    과정을 거치기 때문에 1~2초 정도의 로딩이 걸린다.(정상) */}
                    <div className={"placeholder-box weather-box"}>
                        <Weather/>
                    </div>
                    <div className={"placeholder-box fortune-box"}>
                        <FortuneCookie/>
                    </div>
                </div>

                <div className="placeholder-box" style={{flexGrow: 1}}>달력 (영역)</div>
            </div>
        </main>
    );
};

export default DashboardLayout;
