/* =================================================================
 * 📂 File: src/pages/diary/components/DiaryInfoBar.jsx
 * 📌 역할: 현재 선택된 날짜와, 해당 날짜에 이미 작성된 일기가 있다면 일기 ID를 함께 표시하는 UI 컴포넌트입니다.
 * ✨ 기능: 상위 컴포넌트로부터 받은 selectedDate와 initialDiary 데이터를 시각적으로 표현합니다.
 * ➡️ 데이터 흐름: (In) selectedDate, initialDiary props를 받음 → (Out) h3 태그와 diaryId를 포함한 JSX를 렌더링
 * ================================================================= */
import React from 'react';
import './css/DiaryInfoBar.css';

const DiaryInfoBar = ({ selectedDate, initialDiary }) => {
    // 1. 전달받은 selectedDate (선택된 날짜) 출력
    // 2. initialDiary가 존재하고 diaryId가 있으면, 해당 일기 ID도 화면에 함께 표시
    return (
        <div className="info-bar">
            {/* 1️⃣ 선택된 날짜 표시 */}
            <h3>{selectedDate}</h3>

            {/* 2️⃣ 일기 데이터가 있으면 Diary ID 출력 */}
            {initialDiary && initialDiary.diaryId && (
                <span>Diary ID: {initialDiary.diaryId}</span>
            )}
        </div>
    );
};

export default DiaryInfoBar;
