import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {AppToaster} from "@shared/UI/Toast.jsx";
import './css/MainLayout.css';

const MainLayout = () => {


    return (
        <div className="main-layout-container">  {/*  classname 변경 */}
            {/* 🔔 전역 알림 토스트 컴포넌트 */}
            <AppToaster />

            {/* 🧭 상단 헤더 영역 - 홈 링크 포함 */}
            <header className="app-header">
                <h1><Link to="/"><span>해</span>석하는 감정 <span>일</span>기</Link></h1>
            </header>
            {/* 추가 - <main> 태그로 Outlet을 감싸고 클래스를 부여
                이유: 헤더를 제외한 나머지 모든 공간을 차지하는 메인 컨텐츠 영역을 명확히 구분하고,
                     이 안에 렌더링될 DiaryLayout이 꽉 채울 수 있는 기준 영역을 만들기 위함 */}
            <main className="main-content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;