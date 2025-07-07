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

import React, {useCallback, useRef} from 'react';
import {Routes, Route, Link, useNavigate} from 'react-router-dom';

import 'react-calendar/dist/Calendar.css';
import '../App.css';

import {useGallery} from "@features/gallery/GalleryContext.jsx";
import {AppToaster} from "@shared/UI/Toast.jsx";
import DiaryWritePage from "@pages/DiaryWritePage.jsx";
import DiaryDatePage from "@pages/DiaryDatePage.jsx";
import DiaryIdPage from "@pages/DiaryIdPage.jsx";
import GalleryModal from "@features/gallery/GalleryModal.jsx";
import {useWeeklyTimeline} from "@/hooks/useWeeklyTimeline.js";
import TimelineView from "@features/timeline/TimelineView.jsx";
import {useDiaryData} from "@/hooks/useDiaryData.js";
import SleepWidget from "@features/health/SleepWidget.jsx";
import ExerciseWidget from "@features/health/ExerciseWidget.jsx";
import MealWidget from "@features/health/MealWidget.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import GalleryThumbnail from "@features/gallery/GalleryThumbnail.jsx";

const MainLayout = () => {
    const checkLogin = useCheckLogin();
    // 🎨 갤러리 모달을 열기 위한 함수 가져오기 (FAB에서 사용)
    const { openGallery } = useGallery();

    // 📍 라우팅을 위한 useNavigate 훅
    const navigate = useNavigate();

    // 📅 일기 데이터 관련 상태 (selectedDate 포함)
    const {
        selectedDate,
        diaryForDate,
        handleActionSuccess,
        isLoading,
        setSelectedDate,
    } = useDiaryData();

    // 📆 주간 타임라인 데이터
    const {
        data: timelineData,
        loading: timelineLoading,
    } = useWeeklyTimeline(selectedDate);

    // 📅 타임라인에서 날짜 클릭 시
    const handleSelectDate = useCallback((dateStr) => {
        // 로그인 안 되어 있으면 useCheckLogin 내부에서 처리 (예: 토스트 띄우고 false 리턴)
        if (!checkLogin()) {
            return;
        }
        setSelectedDate(dateStr);
        navigate(`/diary/date/${dateStr}`);
    }, [checkLogin, navigate, setSelectedDate]);

    return (
        <div className="app-container">
            {/* 🔔 전역 알림 토스트 컴포넌트 */}
            <AppToaster />

            {/* 🧭 상단 헤더 영역 - 홈 링크 포함 */}
            <header className="app-header">
                <h1><Link to="/">해일(Haeil) :: 해석하는 감정 일기</Link></h1>
            </header>

            {/* 🖼️ 주 콘텐츠 (3단 구조) */}
            <main className="main-content three-column-layout">
                {/* 📍 좌측: 감정 분석 결과 (차후 구현) */}
                <aside className="left-sidebar">
                    <div className="emotion-analysis">
                        {/* ☁️ 감정 분석 결과 자리 */}
                        <p>감정 분석 결과 컴포넌트 삽입 예정</p>
                    </div>

                    <div className="sidebar-gallery">
                        {/* 갤러리 썸네일 컴포넌트 */}
                        <GalleryThumbnail />
                    </div>
                </aside>
                {/* 📝 중앙: 일기 작성 & 라우팅 */}
                <section className="center-editor">
                    {/* ✅ 주간 타임라인 */}
                    <div className="timeline-header">
                        {timelineLoading ? <p>로딩 중...</p> : (
                            <TimelineView
                                data={timelineData}
                                onSelectDate={handleSelectDate}
                                selectedDate={selectedDate}
                            />
                        )}
                    </div>
                    <Routes>
                        {/* 📝 메인 작성 페이지 (홈 경로) */}
                        <Route
                            path="/"
                            element={
                                <DiaryWritePage
                                    // 🔄 key를 일기 ID 또는 날짜로 설정하여 컴포넌트를 강제로 리렌더링
                                    key={diaryForDate?.diaryId || selectedDate}
                                    initialDiary={diaryForDate}               // ⬅️ 초기 일기 데이터
                                    selectedDate={selectedDate} // 📅 현재 선택된 날짜
                                    onActionSuccess={handleActionSuccess}     // ✅ 성공 시 리프레시
                                    isLoading={isLoading}       // ⏳ 로딩 여부
                                />
                            }
                        />

                        {/* 📅 날짜 기반 라우팅 페이지 */}
                        <Route path="/diary/date/:date" element={<DiaryDatePage />} />

                        {/* 🔎 ID 기반 일기 상세 페이지 */}
                        <Route path="/diary/:diaryId" element={<DiaryIdPage />} />
                    </Routes>
                </section>
                {/* 📌 우측: 건강 기록 위젯 */}
                <aside className="right-sidebar">
                    <ExerciseWidget date={selectedDate} />
                    <SleepWidget date={selectedDate} />
                    <MealWidget date={selectedDate} />
                </aside>
            </main>

            {/* 🖼️ 갤러리 모달 - 사진 관리용 */}
            <GalleryModal />
        </div>
    );
};

export default MainLayout;