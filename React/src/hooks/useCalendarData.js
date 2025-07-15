// src/hooks/useCalendarData.js
import { useQuery } from '@tanstack/react-query';
import { fetchCalendarEntries } from '../api/calendarApi';

export const useCalendarData = (year, month, enabled = true) => {

    return useQuery({
        queryKey: ['calendarEntries', year, month],
        queryFn: () => fetchCalendarEntries(year, month),
        enabled, // 로그인 상태일 때만 요청
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });
};
