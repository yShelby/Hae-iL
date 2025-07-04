// 📄 파일 경로: src/app/App.jsx
// 📌 역할:
//   - React Router의 최상위 라우팅 설정 담당
//   - 모든 경로를 MainLayout으로 전달하여, 내부에서 다시 상세 라우팅 처리
//   - 📦 페이지 컴포넌트들을 포함한 레이아웃 통합 지점
//
// 📊 데이터 흐름도:
//   1️⃣ 사용자가 웹사이트 접속 (ex: /, /diary/1, /diary/date/2025-07-03 등)
//   2️⃣ App 컴포넌트에서 path="/*"에 걸려 MainLayout 렌더링
//   3️⃣ MainLayout 내부의 <Routes>가 다시 세부 경로 처리 (다이어리, 캘린더, 갤러리 등등)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx'; // 💡 메인 레이아웃을 불러옴

function App() {
    return (
        // 🧭 최상위 라우터: 라우팅을 관리하는 라우트 컨테이너
        <Routes>
            {/* 🏠 모든 경로("/*")는 MainLayout 내부에서 처리되도록 설정 */}
            {/* 🔁 MainLayout 안에서 다시 세부 경로를 분기 처리함 */}
            <Route path="/*" element={<MainLayout />} />
        </Routes>
    );
}

export default App;
