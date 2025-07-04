// 📄 파일 경로: src/app/layouts/MainLayout.jsx
// 📌 역할: 전체 앱의 기본 레이아웃을 담당하는 컴포넌트
//        - 헤더(Header), 사이드 캘린더(Aside), 본문 라우팅(Section), FAB 버튼 및 갤러리 모달 포함
//        - 날짜 선택에 따라 일기 데이터를 불러오고, 해당 날짜에 맞는 일기를 표시함
// 📊 데이터 흐름도:
//
//   1️⃣ useGallery() → 갤러리 열기 상태 및 제어 함수 가져옴
//   2️⃣ useDiaryCalendar() → 선택 날짜, 일기 데이터, 로딩 상태 등 제어
//   3️⃣ <Calendar /> → 날짜 선택 시 handleDateClick 실행 → selectedDate 업데이트
//   4️⃣ selectedDate 변경 → diaryForDate 변경 → DiaryWritePage로 전달
//   5️⃣ <Routes> 내부에서 selectedDate 기준으로 일기 페이지 렌더링
//   6️⃣ FloatingActionButton 클릭 → GalleryModal 열림
//   7️⃣ AppToaster → 전체 앱에서 toast 메시지 전역 처리

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';


import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import '../App.css';

import { useDiaryCalendar } from "@/hooks/useDiaryCalendar.js";
import {useGallery} from "@features/gallery/GalleryContext.jsx";
import {AppToaster} from "@shared/UI/Toast.jsx";
import DiaryWritePage from "@pages/DiaryWritePage.jsx";
import DiaryDatePage from "@pages/DiaryDatePage.jsx";
import DiaryIdPage from "@pages/DiaryIdPage.jsx";
import FloatingActionButton from "@features/gallery/FloatingActionButton.jsx";
import GalleryModal from "@features/gallery/GalleryModal.jsx";

const MainLayout = () => {
    // 🎨 갤러리 모달을 열기 위한 함수 가져오기 (FAB에서 사용)
    const { openGallery } = useGallery();

    // 📅 커스텀 캘린더 훅에서 상태 및 제어 함수 가져오기
    const {
        diaryForDate,           // 📝 선택된 날짜에 해당하는 일기 데이터
        handleActionSuccess,    // ✅ 일기 저장/삭제 성공 시 후처리 함수
        ...calendarProps        // 📆 selectedDate, isLoading, tileClassName, 등등
    } = useDiaryCalendar();

    return (
        <div className="app-container">
            {/* 🔔 전역 알림 토스트 컴포넌트 */}
            <AppToaster />

            {/* 🧭 헤더 영역 - 홈 링크 포함 */}
            <header className="app-header">
                <h1><Link to="/">해일(Haeil) - 감성 일기</Link></h1>
            </header>

            {/* 🧱 본문 구조: 사이드 + 콘텐츠 */}
            <main className="main-content">
                {/* 📆 좌측 사이드바에 캘린더 렌더링 */}
                <aside className="sidebarB">
                    <div className="calendar-container">
                        <Calendar
                            onChange={calendarProps.handleDateClick} // 📌 날짜 클릭 시 상태 업데이트
                            value={calendarProps.selectedDate ? new Date(calendarProps.selectedDate) : new Date()} // 현재 선택된 날짜 표시
                            onActiveStartDateChange={({ activeStartDate }) =>
                                calendarProps.setActiveStartDate(activeStartDate) // 🔄 월 변경 시 상태 업데이트
                            }
                            tileClassName={calendarProps.tileClassName} // 🎨 날짜별 커스텀 스타일 지정
                        />
                    </div>
                </aside>

                {/* 📚 본문 콘텐츠 영역 - 라우팅 처리 */}
                <section className="content-area">
                    <Routes>
                        {/* 📝 메인 작성 페이지 (홈 경로) */}
                        <Route
                            path="/"
                            element={
                                <DiaryWritePage
                                    // 🔄 key를 일기 ID 또는 날짜로 설정하여 컴포넌트를 강제로 리렌더링
                                    key={diaryForDate?.diaryId || calendarProps.selectedDate}
                                    initialDiary={diaryForDate}               // ⬅️ 초기 일기 데이터
                                    selectedDate={calendarProps.selectedDate} // 📅 현재 선택된 날짜
                                    onActionSuccess={handleActionSuccess}     // ✅ 성공 시 리프레시
                                    isLoading={calendarProps.isLoading}       // ⏳ 로딩 여부
                                />
                            }
                        />

                        {/* 📅 날짜 기반 라우팅 페이지 */}
                        <Route path="/diary/date/:date" element={<DiaryDatePage />} />

                        {/* 🔎 ID 기반 일기 상세 페이지 */}
                        <Route path="/diary/:diaryId" element={<DiaryIdPage />} />
                    </Routes>
                </section>
            </main>

            {/* ➕ 플로팅 액션 버튼 (FAB) - 클릭 시 갤러리 모달 오픈 */}
            <FloatingActionButton onClick={openGallery} />

            {/* 🖼️ 갤러리 모달 - 사진 관리용 */}
            <GalleryModal />
        </div>
    );
};

export default MainLayout;
