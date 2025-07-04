// ======================================================================
// 📄 File: DiaryIdPage.jsx
//
// 📌 역할:
//   - URL 경로에 포함된 일기 ID(diaryId)를 기반으로
//     백엔드에서 해당 일기 데이터를 조회하여 DiaryWritePage에 전달함
//
// 🔄 데이터 흐름:
// 1️⃣ useParams()로 현재 URL에서 diaryId 추출
//    ⬇
// 2️⃣ diaryId가 존재하면 fetchDiaryByIdAPI() 호출 (비동기)
//    ⬇
// 3️⃣ 응답 데이터 setDiary로 저장
//    ⬇
// 4️⃣ 로딩 완료 후 DiaryWritePage에 initialDiary로 전달
// ======================================================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 🔍 URL에서 diaryId 추출
import DiaryWritePage from './DiaryWritePage';
import {fetchDiaryByIdAPI} from "@api/diaryApi.js"; // 📝 일기 작성 페이지

/**
 * 📘 DiaryIdPage
 * ✅ URL에서 /diary/:diaryId 형태로 접근할 때 해당 ID의 일기를 불러와 렌더링하는 페이지
 */
const DiaryIdPage = () => {
    // 1️⃣ URL에서 :diaryId 파라미터 추출
    const { diaryId } = useParams();

    // 📦 일기 데이터 및 로딩 상태
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2️⃣ diaryId 변경 시마다 일기 조회 API 호출
    useEffect(() => {
        // 🔕 diaryId가 없으면 조회 시도 안 함
        if (!diaryId) {
            setLoading(false);
            return;
        }

        // 3️⃣ 비동기 함수로 일기 데이터 조회
        const fetchDiary = async () => {
            setLoading(true);
            try {
                // 📡 API 호출로 일기 데이터 가져오기
                const response = await fetchDiaryByIdAPI(diaryId);
                setDiary(response.data || null);
            } catch (error) {
                // 🚨 예외 처리: 조회 실패 시 null 처리
                console.error('ID 기반 일기 조회 실패', error);
                setDiary(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDiary();
    }, [diaryId]);

    // 4️⃣ 로딩 중이면 안내 메시지 표시
    if (loading) return <p>로딩 중...</p>;

    // 5️⃣ 조회된 일기 데이터를 기반으로 DiaryWritePage 렌더링
    return (
        <DiaryWritePage
            key={diaryId} // ✅ ID 변경 시 새로 마운트되도록 함
            initialDiary={diary} // 🗃️ 조회된 일기 데이터
            selectedDate={diary?.diaryDate} // 📅 일기 날짜 (있을 시 전달)
        />
    );
};

export default DiaryIdPage;
