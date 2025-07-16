import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import DiaryLayout from '@/layouts/DiaryLayout';
import JournalPage from '@pages/JournalPage';
import DashboardPage from '@pages/DashboardPage';
import DiaryWritePage from '@pages/DiaryWritePage';
import "./css/Homepage.css";

/*
  [이유] 왜 sections 배열을 사용하나요?
  - 향후 '통계 페이지' 같은 새로운 섹션을 추가하거나, '저널'을 '일기'보다 위로 올리는 등
    순서를 변경해야 할 때, 배열의 순서만 바꾸거나 새 객체를 추가하면 되므로 유지보수가 용이
  - 각 객체는 스크롤의 목표 지점이 될 'id'와 렌더링할 'Component'를 가진다
*/
const sections = [
    { id: 'dashboard-section', Component: () => <DashboardLayout><DashboardPage /></DashboardLayout> },
    { id: 'diary-section', Component: () => <DiaryLayout><DiaryWritePage /></DiaryLayout> },
    { id: 'journal-section', Component: () => <JournalPage /> }
    // 예시: 나중에 통계 페이지를 추가하고 싶다면 아래 한 줄만 추가하면 된다.
    // { id: 'stats-section', Component: () => <StatsPage /> }
];

const HomePage = () => {
    return (
        <div className="homepage-container">
            {sections.map(({ id, Component }) => (
                // 각 section에 'homepage-section' 클래스를 부여하여
                // 개별 섹션(대시보드, 다이어리 등)이 화면 전체 높이를 차지하도록
                // 공통 스타일을 적용하기 위함
                <section key={id} id={id} className="homepage-section">
                    <Component />
                </section>
            ))}
        </div>
    );
};

export default HomePage;