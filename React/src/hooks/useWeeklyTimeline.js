// ✅ 이처럼 함수가 정의되어 있어야 함
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDiaryData} from "@/hooks/useDiaryData.js";
import { fetchWeeklyTimelineAPI } from '@/api/timelineApi.js';
import {formatDateToString, getEndOfWeek, getStartOfWeek} from "@shared/utils/dateUtils.js";

export const useWeeklyTimeline = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { selectedDate, setSelectedDate } = useDiaryData(); // 혹은 자체 상태

    const handleSelectDate = (date) => {
        setSelectedDate(date); // 🟡 useDiaryData 훅 내부 상태 업데이트
        navigate(`/diary/date/${date}`); // 📍 상세 일기 페이지 이동
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const today = new Date();
                const start = getStartOfWeek(today); // 이번 주 시작 (예: 월요일)
                const end = getEndOfWeek(today);     // 이번 주 끝 (예: 일요일)

                const startStr = formatDateToString(start);
                const endStr = formatDateToString(end);
                const res = await fetchWeeklyTimelineAPI(startStr, endStr);
                setData(res.data || []);
            } catch (e) {
                console.error("타임라인 데이터 불러오기 실패", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

    }, [selectedDate]);

    return {
        data,
        loading,
        handleSelectDate,
    };
};
