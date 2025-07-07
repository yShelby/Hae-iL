import {useEffect, useState} from "react";
import {useDiaryData} from "@/hooks/useDiaryData.js";
import { fetchWeeklyTimelineAPI } from '@/api/timelineApi.js';
import {formatDateToString, getEndOfWeek, getStartOfWeek} from "@shared/utils/dateUtils.js";

export const useWeeklyTimeline = (selectedDate) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // 해당 selectedDate 기준으로 주 시작과 끝 계산
            const baseDate = selectedDate ? new Date(selectedDate) : new Date();
            const startStr = formatDateToString(getStartOfWeek(baseDate));
            const endStr = formatDateToString(getEndOfWeek(baseDate));

            const res = await fetchWeeklyTimelineAPI(startStr, endStr);
            setData(res.data || []);
            setLoading(false);
        };
        fetchData();

    }, [selectedDate]);

    return {
        data,
        loading
    };
};