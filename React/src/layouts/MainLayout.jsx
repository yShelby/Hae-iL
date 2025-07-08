import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {AppToaster} from "@shared/UI/Toast.jsx";
import './css/MainLayout.css';

const MainLayout = () => {


    return (
        <div className="app-container">
            {/* 🔔 전역 알림 토스트 컴포넌트 */}
            <AppToaster />

            {/* 🧭 상단 헤더 영역 - 홈 링크 포함 */}
            <header className="app-header">
                <h1><Link to="/">해일(Haeil) :: 해석하는 감정 일기</Link></h1>
            </header>
            <Outlet />
        </div>
    );
};

export default MainLayout;