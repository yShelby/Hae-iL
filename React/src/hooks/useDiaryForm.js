// ======================================================================
// 📄 File: useDiaryForm.js
//
// 📌 역할:
// - 📝 일기 작성 폼의 상태(제목, 날씨)를 관리하는 커스텀 훅
//
// 🔄 데이터 흐름:
// 1️⃣ 초기 일기 데이터(initialDiary) 수신 시 상태 동기화
// 2️⃣ 사용자가 입력 필드를 변경하면 setField 함수로 상태 업데이트
// 3️⃣ 변경된 상태(diaryState)를 폼 컴포넌트가 사용하여 렌더링
// ======================================================================

import { useState, useEffect, useCallback } from 'react';

/**
 * [추가] 초기 상태를 생성하는 헬퍼 함수
 * @param {object|null} initialData - 서버에서 받은 원본 일기 또는 임시저장 데이터
 * @returns {object} - 모든 필드가 포함된 초기 폼 상태 객체
 */
const getInitialState = (initialData) => ({
    title: initialData?.title || '',
    weather: initialData?.weather || '맑음',
    // [추가] 운동, 식사, 수면 데이터 필드를 초기 상태에 포함
    // DiaryWritePage에서 이 필드들을 사용하지 않더라도, 다른 위젯과의 데이터 구조 일관성을 위해 추가
    exercise: initialData?.exercise || '',
    meal: initialData?.meal || '',
    sleep: initialData?.sleep || '',
});

/**
 * 🎯 useDiaryForm 훅: 일기 폼 상태 관리
 * @param {object|null} initialDiary - 초기 일기 데이터(수정 시 주입됨)
 * @returns {object} { diaryState, setField }
 */
export const useDiaryForm = (initialDiary) => {
    // 1️⃣ 일기 폼 상태 정의: 제목과 날씨, 기본값은 빈 문자열과 '맑음'
    const [diaryState, setDiaryState] = useState({
        title: '',
        weather: '맑음',
    });

    // 2️⃣ 초기 데이터 변경 시 상태 동기화: 수정 모드 또는 신규 작성 시 반영
    useEffect(() => {
        if (initialDiary) {
            setDiaryState({
                title: initialDiary.title || '',       // 제목 동기화
                weather: initialDiary.weather || '맑음', // 날씨 동기화
            });
        } else {
            // 신규 작성 시 기본값 초기화
            setDiaryState({ title: '', weather: '맑음' });
        }
    }, [initialDiary]);

    // 3️⃣ 특정 필드값을 변경하는 함수 (title 또는 weather 등)
    const setField = useCallback((field, value) => {
        setDiaryState((prev) => ({ ...prev, [field]: value }));
    }, []);

    // [추가] 폼 상태를 초기값으로 리셋하는 함수. '닫기' 버튼 클릭 시 사용된다.
    const resetForm = useCallback(() => {
        // setDiaryState({ title: '', weather: '맑음' });
        // [수정] 단순히 빈 값으로 만드는 것이 아니라, initialDiary를 기반으로 리셋
        setDiaryState(getInitialState(initialDiary));
    }, [initialDiary]); // 의존성 추가

    // 4️⃣ 외부에 상태와 필드 변경 함수를 반환
    return { diaryState, setField, resetForm }; // setDiaryState 제거
};
