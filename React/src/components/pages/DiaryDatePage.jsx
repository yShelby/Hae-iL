// ======================================================================
// 📄 File: DiaryDatePage.jsx
//
// 📌 역할:
//   - 📅 URL 경로에 포함된 날짜(:date)를 기반으로
//     해당 날짜의 일기 데이터를 조회해 DiaryWritePage에 전달하는 컴포넌트
//
// 🔄 데이터 흐름:
// 1️⃣ URL에서 날짜 파라미터 추출 → useParams()
//    ⬇
// 2️⃣ 날짜 형식 검증 (YYYY-MM-DD)
//    ⬇
// 3️⃣ fetchDiaryByDateAPI(date)로 서버에 일기 요청
//    ⬇
// 4️⃣ 응답 결과를 상태에 저장 (setDiary)
//    ⬇
// 5️⃣ DiaryWritePage에 initialDiary로 전달하여 렌더링
// ======================================================================

import React, { useState, useEffect } from 'react';
import {useOutletContext, useParams} from 'react-router-dom'; // 🔍 URL 파라미터 추출
import DiaryWritePage from './DiaryWritePage';
import {fetchDiaryByDateAPI} from "@api/diaryApi.js"; // 📝 일기 작성/수정 페이지

/**
 * 📘 DiaryDatePage
 * ✅ URL 경로가 /diary/date/:date 형태일 때,
 * 해당 날짜의 일기를 조회하고 DiaryWritePage로 전달하는 역할
 */
const DiaryDatePage = () => {
    // 1️⃣ URL에서 날짜 파라미터(:date) 추출
    const { date } = useParams();

    const layoutContext = useOutletContext(); // ✅ 부모(DiaryLayout)의 context를 받음

    // 📦 상태: 일기 데이터와 로딩 여부
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2️⃣ 컴포넌트 마운트 또는 date 변경 시 실행
    useEffect(() => {
        // ✅ 날짜 포맷 검증: "YYYY-MM-DD"
        const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
        if (!date || !isValidDateFormat) {
            // ❌ 날짜가 없거나 잘못된 포맷일 경우 초기화 처리
            setLoading(false);
            setDiary(null);
            return;
        }

        // 3️⃣ API 호출 함수 정의
        const fetchDiary = async () => {
            setLoading(true); // ⏳ 로딩 시작
            try {
                // 4️⃣ 서버에 날짜 기반 일기 데이터 요청
                const response = await fetchDiaryByDateAPI(date);
                setDiary(response.data || null); // ✅ 정상 응답 시 저장
            } catch (error) {
                // ❗ 일기 없을 경우(204 No Content) 외에는 콘솔에 에러 출력
                if (error.response?.status !== 204) {
                    console.error('날짜 기반 일기 조회 실패', error);
                }
                setDiary(null); // 실패 시 상태 초기화
            } finally {
                setLoading(false); // ⏹️ 로딩 종료
            }
        };

        fetchDiary();
    }, [date]);

    // 5️⃣ 로딩 중일 때 로딩 메시지 표시
    if (loading) return <p>로딩 중...</p>;

    // ✅ 일기 작성/수정 페이지에 데이터 전달
    return (
        <DiaryWritePage
            key={date} // 🆔 날짜 변경 시 컴포넌트 재마운트 유도
            initialDiary={diary} // 📄 조회된 일기 데이터
            selectedDate={date} // 📅 현재 선택된 날짜
            // ⚠️ onActionSuccess는 MainLayout 내부에서만 전달됨
            isLoading={loading}  // 이 컴포넌트의 로딩 상태
            onDiaryUpdated={layoutContext?.onDiaryUpdated}
            onEmotionUpdated={layoutContext?.onEmotionUpdated}
            setSelectedDiaryId={layoutContext?.setSelectedDiaryId}
        />
    );
};

export default DiaryDatePage;
