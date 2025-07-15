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
import {Routes, Route} from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DiaryLayout from "@/layouts/DiaryLayout.jsx";
import DiaryWritePage from "@pages/DiaryWritePage.jsx";
import DiaryDatePage from "@pages/DiaryDatePage.jsx";
import DiaryIdPage from "@pages/DiaryIdPage.jsx"; // 💡 메인 레이아웃을 불러옴
import './App.css';
import DashboardLayout from "@/layouts/DashboardLayout.jsx";
import DashboardPage from "@pages/DashboardPage.jsx";
import JournalPage from "@pages/JournalPage.jsx";
import GalleryPage from "@pages/GalleryPage.jsx";
import CalendarPage from "@pages/CalendarPage.jsx";
import Calendar from "@features/calendar/Calendar.jsx";

function App() {
    return (
        // 🧭 최상위 라우터: 라우팅을 관리하는 라우트 컨테이너
        <Routes>
            <Route path="/" element={<MainLayout />}>
                {/* 루트 대시보드 전용 레이아웃 예시*/}
                <Route path={""} element={<DashboardLayout />}>
                    <Route index element={<DashboardPage />} />
                </Route>

                {/* 다이어리 전용 레이아웃 */}
                <Route path="diary" element={<DiaryLayout />}>
                    <Route index element={<DiaryWritePage />} />
                    <Route path="date/:date" element={<DiaryDatePage />} />
                    <Route path=":diaryId" element={<DiaryIdPage />} />
                </Route>

                {/* 대시보드 카운트 클릭시 journal과 gallery로 가도록 경로 추가 */}
                <Route path="journal" element={<JournalPage />} />
                <Route path="gallery" element={<DiaryLayout />}>
                    <Route index element={<GalleryPage />} />
                </Route>

                {/* 캘린더 페이지 라우트 */}
                <Route path="calendar" element={<Calendar />} />
            </Route>
        </Routes>

    );
}

export default App;
