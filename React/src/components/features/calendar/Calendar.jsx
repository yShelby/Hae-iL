import React, { useState } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from "date-fns";
import { useAuth } from '../auth/AuthContext';
import { useCalendarData } from '@/hooks/useCalendarData.js';
import CalendarHead from "./CalendarHead";
import CalendarGrid from "./CalendarGrid";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  width: ${({ width }) => width || "420px"};
  height: ${({ height }) => height || "auto"};
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

function Calendar({
                      width = "550px",      // 전체 캘린더 너비
                      height = "auto",      // 전체 캘린더 높이
                      cellHeight = "60px"   // 셀 높이
                  }) {
    const { user, loading } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const [selectedDate, setSelectedDate] = useState(null);

    const { data: calendarEntries, isLoading, isError } = useCalendarData(year, month, !!user);

    console.log("calendarEntries", calendarEntries);

    if (loading) return <div>로딩 중...</div>;
    if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;


    // 월 이동 함수
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const goToday = () => setCurrentDate(new Date());

    // 캘린더 그리드 날짜 계산
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            days.push(day);
            day = addDays(day, 1);
        }
        rows.push(days);
        days = [];
    }

    return (
        <CalendarWrapper width={width} height={height}>
            <CalendarHead
                onPrev={prevMonth}
                onToday={goToday}
                onNext={nextMonth}
                currentDate={currentDate}
            />
            <CalendarGrid
                rows={rows}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                calendarEntries={calendarEntries || []}
                isLoggedIn={!!user}
                width="500px"         // 캘린더 전체 너비 조절
                cellHeight={cellHeight}
            />
        </CalendarWrapper>
    );
}

export default Calendar;
