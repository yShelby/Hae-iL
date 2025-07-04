// 📄 파일 경로: src/hooks/useDiaryCalendar.js
// 📌 역할:
//   - 📆 캘린더 UI에서 사용할 날짜 상태 및 일기 데이터를 관리하는 커스텀 훅
//   - ✍️ 특정 날짜에 작성된 일기 불러오기
//   - ✅ 작성된 날짜 표시 (점 찍힘)
//   - 🧭 날짜 클릭 시 해당 상세 일기 페이지로 이동
//   - 🔒 로그인 상태가 아닐 경우, 토스트 경고 출력 후 리다이렉트 방지

// 📊 데이터 흐름도:
// 1️⃣ 캘린더 날짜 클릭 (handleDateClick)
// 2️⃣ 로그인 상태 확인 → ❌ 아니면 토스트 후 중단
// 3️⃣ ✅ 맞다면 날짜 저장 + 페이지 이동 (/diary/date/:date)
// 4️⃣ useEffect로 선택된 날짜 기반 일기 데이터 fetch
// 5️⃣ activeStartDate 변경 시 해당 월의 작성된 날짜 fetch
// 6️⃣ 일기 저장/삭제 시 handleActionSuccess로 상태 업데이트

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "@features/auth/AuthContext.jsx";
import {formatDateToString} from "@shared/utils/dateUtils.js";
import {fetchActiveDatesAPI, fetchDiaryByDateAPI} from "@api/diaryApi.js";
import {showToast} from "@shared/UI/Toast.jsx";

export const useDiaryCalendar = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // 🔒 현재 로그인된 사용자 정보

    // ✅ 현재 선택된 날짜 상태 (기본: 오늘)
    const [selectedDate, setSelectedDate] = useState(formatDateToString(new Date()));

    // 📅 현재 보고 있는 달(캘린더의 시작 날짜)
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    // 📘 선택된 날짜의 일기 데이터
    const [diaryForDate, setDiaryForDate] = useState(null);

    // 🔵 일기가 존재하는 날짜 목록 (Set으로 관리)
    const [activeDates, setActiveDates] = useState(new Set());

    // ⏳ 일기 조회 로딩 여부
    const [isLoading, setIsLoading] = useState(true);

    // 📥 선택된 날짜의 일기 데이터를 서버에서 가져옴
    const fetchDiaryForDate = useCallback(async (dateStr) => {
        if (!dateStr) return;
        setIsLoading(true);
        try {
            const response = await fetchDiaryByDateAPI(dateStr);
            setDiaryForDate(response.data);
        } catch (error) {
            if (error.response && error.response.status !== 204) {
                console.error('날짜 기반 일기 조회 실패', error);
            }
            setDiaryForDate(null); // 일기가 없으면 null로 설정
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 📥 현재 보고 있는 월에 해당하는 일기 작성 날짜 목록 조회
    const fetchActiveDates = useCallback(async (date) => {
        if (!date) return;
        try {
            const response = await fetchActiveDatesAPI(date);
            setActiveDates(new Set(response.data)); // 문자열 Set으로 저장
        } catch (error) {
            console.error('활성 날짜 조회 실패', error);
            setActiveDates(new Set());
        }
    }, []);

    // ✨ 일기 작성 또는 삭제 후 호출되는 콜백 함수
    const handleActionSuccess = useCallback((newDiary) => {
        setDiaryForDate(newDiary); // 선택 날짜의 일기 갱신
        if (user) {
            fetchActiveDates(activeStartDate); // 다시 active 날짜 fetch
        }
    }, [activeStartDate, fetchActiveDates, user]);

    // ✅ 선택된 날짜 또는 로그인 상태 변경 시 일기 fetch
    useEffect(() => {
        if (user) {
            fetchDiaryForDate(selectedDate);
        } else {
            setIsLoading(false);
            setDiaryForDate(null);
        }
    }, [selectedDate, fetchDiaryForDate, user]);

    // ✅ 달(month) 변경되거나 로그인 상태 변경 시 activeDates fetch
    useEffect(() => {
        if (user) {
            fetchActiveDates(activeStartDate);
        } else {
            setActiveDates(new Set());
        }
    }, [activeStartDate, fetchActiveDates, user]);

    // 📆 캘린더에서 날짜 클릭 시 동작
    const handleDateClick = useCallback((dateObj) => {
        // ✋ 비로그인 상태면 작성 불가
        if (!user) {
            showToast.error('일기를 보거나 작성하려면 로그인이 필요합니다.');
            return;
        }

        // 🧭 선택한 날짜로 이동
        const dateStr = formatDateToString(dateObj);
        setSelectedDate(dateStr);
        navigate(`/diary/date/${dateStr}`);
    }, [navigate, user]);

    // 🟢 캘린더 타일에 점 표시해주는 함수
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = formatDateToString(date);
            if (activeDates.has(dateStr)) {
                return 'active-diary-date'; // ✨ 이 클래스가 있으면 점이 표시됨
            }
        }
        return null;
    };

    // 📦 훅에서 제공하는 값들 반환
    return {
        selectedDate,
        setSelectedDate,
        activeStartDate,
        setActiveStartDate,
        diaryForDate,
        activeDates,
        isLoading,
        handleDateClick,
        tileClassName,
        handleActionSuccess,
    };
};
