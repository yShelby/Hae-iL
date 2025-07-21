import React, {useEffect, useState} from 'react';
import {Outlet, Route, Routes, useLocation, useParams} from 'react-router-dom';
import {useWeeklyTimeline} from '@/hooks/useWeeklyTimeline.js';
import {useCheckLogin} from '@/hooks/useCheckLogin.js';
import {useNavigate} from 'react-router-dom';
import TimelineView from "@features/timeline/TimelineView.jsx";
import ExerciseWidget from "@features/health/ExerciseWidget.jsx";
import SleepWidget from "@features/health/SleepWidget.jsx";
import MealWidget from "@features/health/MealWidget.jsx";
import GalleryThumbnail from "@features/gallery/GalleryThumbnail.jsx";
import GalleryModal from "@features/gallery/GalleryModal.jsx";
import './css/DiaryLayout.css';
import MoodPage from "@pages/MoodPage.jsx";
import {fetchDiaryByDateAPI} from "@api/diaryApi.js";
import {formatDateToString} from "@shared/utils/dateUtils.js";
import {AnimatePresence, motion as Motion} from 'framer-motion';
import {useDiaryData} from "@/hooks/useDiaryData.js";
import {usePageAnimation} from "@/hooks/usePageAnimation.js";
import DiaryIdPage from "@pages/DiaryIdPage.jsx";
import DiaryDatePage from "@pages/DiaryDatePage.jsx";
import DiaryWritePage from "@pages/DiaryWritePage.jsx";

const DiaryLayout = ({children}) => { // children(자식 comp) 추가
    const {date: urlDate} = useParams(); // URL에서 날짜 추출
    const checkLogin = useCheckLogin();
    // const navigate = useNavigate();
    const location = useLocation(); // ✅ 페이지 이동 시 전달된 state를 받기 위해 추가

    // useDiaryData 훅에서 상태/함수 가져오기
    const {
        user,
        selectedDate,
        setSelectedDate,
        diaryForDate: initialDiary,
        isLoading: isDiaryLoading,
        handleDateClick,   // 날짜 선택된     시 네비게이션 및 상태 변경 포함
        handleDiaryUpdated,
    } = useDiaryData();

    /**
     * 수정
     * location.state?.date가 있으면 그 값을, 없으면 오늘 날짜를 selectedDate의 초기값으로 사용
     */
    const [selectedDiaryId, setSelectedDiaryId] = useState(null); // 선택된 일기 ID 상태
    const [emotionRefreshKey, setEmotionRefreshKey] = useState(0); // 감정 분석 새로고침 키

    // [추가] 내부 콘텐츠 애니메이션을 위한 훅 호출
    const animationProps = usePageAnimation();
    const {key, ...restAnimationProps} = animationProps; // key 분리

    // URL에서 날짜가 있으면 selectedDate를 업데이트
    useEffect(() => {
        if (urlDate && urlDate !== selectedDate) {
            setSelectedDate(urlDate);
        }
    }, [urlDate, selectedDate, setSelectedDate]);
    const {
        data: timelineData,
        loading: timelineLoading,
        refetch: refetchTimeline,
    } = useWeeklyTimeline(selectedDate);

    const handleSelectDate = (dateStr) => {
        if (!checkLogin()) return;
        setSelectedDate(dateStr);
        // navigate(`/diary/date/${dateStr}`);
    };

    const handleDataChange = () => {
        refetchTimeline?.();
    };

    useEffect(() => {
        setSelectedDiaryId(initialDiary?.diaryId ?? null);
    }, [initialDiary]);

    // 감정 분석 결과가 수정되었을 때 호출하는 함수
    const handleEmotionUpdated = () => {
        // 감정 분석 결과 갱신용 키 증가시키기 (강제 리렌더링/데이터 재조회 유도)
        setEmotionRefreshKey(prev => prev + 1);

        // 선택된 일기 데이터도 다시 가져오기
        handleDiaryUpdated();
    };
    return (
        <main className="main-content three-column-layout">
            {/* 좌측 사이드바 */}
            <aside className="left-sidebar">
                <div className="emotion-analysis">
                    <MoodPage
                        refreshKey={emotionRefreshKey} // 갱신 키 전달
                        selectedDiaryId={selectedDiaryId}
                    />
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
                            isLoggedIn={!!user} // 로그인 여부 전달
                        />
                    )}
                </div>
                {/* 추가 - Outlet을 div로 감싸서 레이아웃 제어를 위한 컨테이너 추가
                        - 중앙 컬럼(.center-editor) 내부에서 타임라인 헤더를 제외한
                        - 나머지 공간을 Outlet이 모두 차지하게 만들어, DiaryWritePage가
                        - 이 컨테이너 안에서만 렌더링되고 스크롤되도록 하기 위함
                */}
                <div className="outlet-container">
                    {/* [추가] DiaryLayout 내부의 콘텐츠 전환을 위한 AnimatePresence */}
                    <AnimatePresence mode={"wait"}>
                        <Motion.div key={key} {...restAnimationProps}>
                            <Outlet context={{
                                initialDiary,
                                setSelectedDiaryId,
                                selectedDate, // ✅ 추가: 자식 컴포넌트(DiaryWritePage)가 현재 날짜를 알 수 있도록 전달
                                isLoading: isDiaryLoading, // ✅ 추가: 일기 로딩 상태 전달
                                onDiaryUpdated: handleDiaryUpdated,
                                onEmotionUpdated: handleEmotionUpdated,
                                onDataChange: handleDataChange,
                            }}/>
                        </Motion.div>
                    </AnimatePresence>
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
