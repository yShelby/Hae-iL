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
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DiaryLayout from "@/layouts/DiaryLayout.jsx";
import DiaryDatePage from "@pages/DiaryDatePage.jsx";
import DiaryIdPage from "@pages/DiaryIdPage.jsx";
import DashboardLayout from "@/layouts/DashboardLayout.jsx";
import DashboardPage from "@pages/DashboardPage.jsx";
import JournalPage from "@pages/JournalPage.jsx";
import GalleryPage from "@pages/GalleryPage.jsx";
import {QuestionProvider} from "@shared/context/QuestionContext.jsx";
import SleepWidget from "@features/health/SleepWidget.jsx";
import ExerciseWidget from "@features/health/ExerciseWidget.jsx";
import MealWidget from "@features/health/MealWidget.jsx";
import {AnimatePresence} from "framer-motion";
import Calendar from "@features/calendar/Calendar.jsx";
import AnimationLayout from "@/layouts/AnimationLayout.jsx";
import DiaryPage from "@pages/DairyPage.jsx";

/**
 * ✨ [추가] 애니메이션과 라우팅을 실제로 처리하는 내부 컴포넌트
 * 📌 이유: useLocation, useVirtualScroll 같은 훅들은 Router 컨텍스트 하위에서 호출 필요
 * App 컴포넌트 내부에 로직을 처리하는 별도의 컴포넌트를 만들어 구조를 명확하게 하고 훅의 규칙을 준수
 */
const AnimatedRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // [추가] React의 navigate 함수를 전역 '우체통'에 할당
    // useEffect를 사용하여 컴포넌트가 렌더링될 때 안정적으로 할당되도록 한다.
    React.useEffect(() => {
        // window.haeIlHistory 객체가 존재하는지 확인하고 navigate 함수를 할당
        if (window.haeIlHistory) {
            window.haeIlHistory.navigate = navigate;
        }
    }, [navigate]); // navigate 함수가 변경될 때만 다시 실행된다(일반적으로는 한 번만 실행).

    // [추가] AnimatePresence가 최상위 경로 변경(예: /diary -> /journal)에만 반응하도록 key를 수정
    const topLevelKey = location.pathname.split('/')[1] || 'root';

    return (
        // AnimatePresence는 자식 컴포넌트가 DOM에서 제거될 때 퇴장 애니메이션을 실행 가능
        // mode="wait"는 퇴장 애니메이션이 끝날 때까지 새로운 컴포넌트의 등장을 기다리게 한다.
        <AnimatePresence mode="wait">
            {/*
              Routes 컴포넌트에 location과 key를 전달하는 것이 매우 중요
              AnimatePresence가 URL 변경을 감지하고 애니메이션을 트리거하기 위해
              반드시 key가 변경되어야 합니다. location.pathname은 URL이 바뀔 때마다
              고유한 값을 가지므로 key로 사용하기에 적합
            */}
            {/*             <Routes location={location} key={location.pathname}> */}
            <Routes location={location} key={topLevelKey}>
                <Route path="/" element={<MainLayout/>}>
                    <Route element={<AnimationLayout/>}>
                        <Route path={""} element={<DashboardLayout/>}>
                            <Route index element={<DashboardPage/>}/>
                        </Route>

                        <Route path="diary" element={<DiaryLayout/>} />

                        <Route path="journal" element={<JournalPage/>}/>

                        <Route path="gallery" element={<DiaryLayout/>}>
                            <Route index element={<GalleryPage/>}/>
                        </Route>
                        {/* 캘린더 페이지 라우트 */}
                        <Route path="calendar" element={<Calendar/>}/>
                    </Route>

                    <Route path="diary" element={<DiaryLayout/>}>
                        <Route index element={<DiaryPage/>}/>
                        <Route path="date/:date" element={<DiaryDatePage/>}/>
                        <Route path=":diaryId" element={<DiaryIdPage/>}/>
                        <Route path="sleep/date/:date" element={<SleepWidget/>}/>
                        <Route path="exercise/date/:date" element={<ExerciseWidget/>}/>
                        <Route path="meal/date/:date" element={<MealWidget/>}/>
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        // 오늘의 질문이 dashboard와 diary 간 공유를 위해 추가
        <QuestionProvider>
            <AnimatedRoutes/>
        </QuestionProvider>
    );
}

export default App;
