/* =================================================================
 * 📂 File: src/pages/diary/components/DiaryInfoBar.jsx
 * 📌 역할: 현재 선택된 날짜와, 해당 날짜에 이미 작성된 일기가 있다면 일기 ID를 함께 표시하는 UI 컴포넌트입니다.
 * ✨ 기능: 상위 컴포넌트로부터 받은 selectedDate와 initialDiary 데이터를 시각적으로 표현합니다.
 * ➡️ 데이터 흐름: (In) selectedDate, initialDiary props를 받음 → (Out) h3 태그와 diaryId를 포함한 JSX를 렌더링
 * ================================================================= */
import React from 'react';
import './css/DiaryInfoBar.css';

const DiaryInfoBar = ({ selectedDate, initialDiary }) => {
    // 날짜 포맷 변환 함수: "2025-07-28" → "2025년 7월 28일"
    const formatDateToKorean = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
    };

    return (
        <div className="info-bar">
            {/* 1️⃣ 선택된 날짜 표시 (한국어 형식) */}
            <h3>{formatDateToKorean(selectedDate)}</h3>

            {/* 2️⃣ 일기 데이터가 있으면 "3번째 일기" 형태로 출력 */}
            {initialDiary && initialDiary.diaryId && (
                <span>{initialDiary.diaryId}번째 일기</span>
            )}
        </div>
    );
};

export default DiaryInfoBar;
