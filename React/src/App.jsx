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
import {Routes, Route, useLocation} from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DiaryLayout from "@/layouts/DiaryLayout.jsx";
import DiaryWritePage from "@pages/DiaryWritePage.jsx";
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
import {useVirtualScroll} from "@/hooks/useVirtualScroll.js";
import {AnimatePresence} from "framer-motion";
import Calendar from "@features/calendar/Calendar.jsx";
import Charts from "@pages/Charts.jsx";

/**
 * ✨ [추가] 애니메이션과 라우팅을 실제로 처리하는 내부 컴포넌트
 * 📌 이유: useLocation, useVirtualScroll 같은 훅들은 Router 컨텍스트 하위에서 호출 필요
 * App 컴포넌트 내부에 로직을 처리하는 별도의 컴포넌트를 만들어 구조를 명확하게 하고 훅의 규칙을 준수
 */
const AnimatedRoutes = () => {
    const location = useLocation();

    // 가상 스크롤 훅을 호출하여 이 컴포넌트가 렌더링될 때 스크롤 제어를 활성화
    // useVirtualScroll();

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
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainLayout/>}>
                    <Route path={""} element={<DashboardLayout/>}>
                        <Route index element={<DashboardPage/>}/>
                    </Route>
                    <Route path="diary" element={<DiaryLayout/>}>
                        <Route index element={<DiaryWritePage/>}/>
                        <Route path="date/:date" element={<DiaryDatePage/>}/>
                        <Route path=":diaryId" element={<DiaryIdPage/>}/>
                        <Route path="sleep/date/:date" element={<SleepWidget />} />
                        <Route path="exercise/date/:date" element={<ExerciseWidget />} />
                        <Route path="meal/date/:date" element={<MealWidget/>} />
                    </Route>
                    <Route path="journal" element={<JournalPage/>}/>
                    <Route path="gallery" element={<DiaryLayout/>}>
                        <Route index element={<GalleryPage/>}/>
                    </Route>
                    {/* 캘린더 페이지 라우트 */}
                    <Route path="calendar" element={<Calendar />} />
                    {/* 차트 페이지 라우트 */}
                    <Route path="charts" element={<Charts/>}/>
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        // 오늘의 질문이 dashboard와 diary 간 공유를 위해 추가
        <QuestionProvider>
            {/*/!*🧭 최상위 라우터: 라우팅을 관리하는 라우트 컨테이너*!/*/}
            {/*<Routes>*/}
            {/*    <Route path="/" element={<MainLayout/>}>*/}
            {/*        /!* 루트 대시보드 전용 레이아웃 예시*!/*/}
            {/*        <Route path={""} element={<DashboardLayout/>}>*/}
            {/*            <Route index element={<DashboardPage/>}/>*/}
            {/*        </Route>*/}

            {/*        /!* 다이어리 전용 레이아웃 *!/*/}
            {/*        <Route path="diary" element={<DiaryLayout/>}>*/}
            {/*            <Route index element={<DiaryWritePage/>}/>*/}
            {/*            <Route path="date/:date" element={<DiaryDatePage/>}/>*/}
            {/*            <Route path=":diaryId" element={<DiaryIdPage/>}/>*/}

            {/*            /!* ✅ 아래 3개 미션 경로 추가 *!/*/}
            {/*            <Route path="sleep/date/:date" element={<SleepWidget />} />*/}
            {/*            <Route path="exercise/date/:date" element={<ExerciseWidget />} />*/}
            {/*            <Route path="meal/date/:date" element={<MealWidget/>} />*/}
            {/*        </Route>*/}

            {/*        /!* 대시보드 카운트 클릭시 journal과 gallery로 가도록 경로 추가 *!/*/}
            {/*        <Route path="journal" element={<JournalPage/>}/>*/}
            {/*        <Route path="gallery" element={<DiaryLayout/>}>*/}
            {/*            <Route index element={<GalleryPage/>}/>*/}
            {/*        </Route>*/}
            {/*    </Route>*/}
            {/*</Routes>*/}
            <AnimatedRoutes />
        </QuestionProvider>
    );
}

export default App;
