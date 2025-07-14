import React from 'react';
import {Outlet} from 'react-router-dom';
import {useWeeklyTimeline} from '@/hooks/useWeeklyTimeline.js';
import {useDiaryData} from '@/hooks/useDiaryData.js';
import {useCheckLogin} from '@/hooks/useCheckLogin.js';
import {useNavigate} from 'react-router-dom';
import TimelineView from "@features/timeline/TimelineView.jsx";
import ExerciseWidget from "@features/health/ExerciseWidget.jsx";
import SleepWidget from "@features/health/SleepWidget.jsx";
import MealWidget from "@features/health/MealWidget.jsx";
import GalleryThumbnail from "@features/gallery/GalleryThumbnail.jsx";
import GalleryModal from "@features/gallery/GalleryModal.jsx";
import './css/DiaryLayout.css';

const DiaryLayout = () => {
    const checkLogin = useCheckLogin();
    const navigate = useNavigate();
    const {
        selectedDate,
        setSelectedDate,
    } = useDiaryData();

    const {
        data: timelineData,
        loading: timelineLoading,
        refetch: refetchTimeline,
    } = useWeeklyTimeline(selectedDate);

    const handleSelectDate = (dateStr) => {
        if (!checkLogin()) return;
        setSelectedDate(dateStr);
        navigate(`/diary/date/${dateStr}`);
    };

    const handleDataChange = () => {
        refetchTimeline?.();
    };

    return (
        <main className="main-content three-column-layout">
            {/* 좌측 사이드바 */}
            <aside className="left-sidebar">
                <div className="emotion-analysis">
                    <p>감정 분석 결과 컴포넌트 삽입 예정</p>
                </div>
                <div className="sidebar-gallery">
                    <GalleryThumbnail/>
                </div>
            </aside>

            {/* 중앙: 타임라인 + 라우트 결과 */}
            <section className="center-editor">
                <div className="timeline-header">
                    {timelineLoading ? <p>로딩 중...</p> : (
                        <TimelineView
                            data={timelineData}
                            onSelectDate={handleSelectDate}
                            selectedDate={selectedDate}
                        />
                    )}
                </div>
                {/* 추가 - Outlet을 div로 감싸서 레이아웃 제어를 위한 컨테이너 추가
                    - 중앙 컬럼(.center-editor) 내부에서 타임라인 헤더를 제외한
                    - 나머지 공간을 Outlet이 모두 차지하게 만들어, DiaryWritePage가
                    - 이 컨테이너 안에서만 렌더링되고 스크롤되도록 하기 위함
                */}
                <div className="outlet-container">
                    <Outlet/>
                </div>
            </section>

            {/* 우측: 건강 위젯 */}
            <aside className="right-sidebar">
                <ExerciseWidget date={selectedDate} onDataChange={handleDataChange}/>
                <SleepWidget date={selectedDate} onDataChange={handleDataChange}/>
                <MealWidget date={selectedDate} onDataChange={handleDataChange}/>
            </aside>

            {/* 다이어리 레이아웃 내에만 갤러리 모달 포함 */}
            <GalleryModal/>
        </main>
    );
};

export default DiaryLayout;
