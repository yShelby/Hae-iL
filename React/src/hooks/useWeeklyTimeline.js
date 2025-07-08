import {useCallback, useEffect, useState} from "react";
import {useDiaryData} from "@/hooks/useDiaryData.js";
import { fetchWeeklyTimelineAPI } from '@/api/timelineApi.js';
import {formatDateToString, getEndOfWeek, getStartOfWeek} from "@shared/utils/dateUtils.js";

export const useWeeklyTimeline = (selectedDate) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const baseDate = selectedDate ? new Date(selectedDate) : new Date();
            const startStr = formatDateToString(getStartOfWeek(baseDate));
            const endStr = formatDateToString(getEndOfWeek(baseDate));

            const res = await fetchWeeklyTimelineAPI(startStr, endStr);
            setData(res.data || []);
        } catch (err) {
            console.error("타임라인 데이터 fetch 실패:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        refetch: fetchData,
    };
};