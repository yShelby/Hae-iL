import React, { useState } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from "date-fns";
import { useAuth } from '@shared/context/AuthContext';
import { useCheckLogin } from '@/hooks/useCheckLogin.js'
import { useCalendarData } from '@/hooks/useCalendarData.js';
import CalendarHead from "./CalendarHead";
import CalendarGrid from "./CalendarGrid";
import styled from "styled-components";

const CalendarWrapper = styled.div`
      display: flex;flex-direction: column;align-items: center;justify-content: center;
      width: ${({ width }) => width || "420px"};
      height: ${({ height }) => height || "auto"};
      background: rgb(255 255 255 / 0.5);
      border-radius: 17px;
      box-shadow: var(--shadow-only);
      padding: 10px 10px;
      box-sizing: border-box;
    //border: 3px dotted cyan;
`;

function Calendar({
                      width = "670px",      // 전체 캘린더 너비
                      height = "100%",      // 전체 캘린더 높이
                      cellHeight = "85px"   // 셀 높이
                  }) {
    const { user, loading } = useAuth();
    const checkLogin = useCheckLogin();
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

    const handleSelectedDate = (date) => {
        if (!checkLogin()) return; // 비로그인일 경우 토스트만 띄우고 중단
        setSelectedDate(date); // 로그인된 경우에만 state 업데이트
    }

    return (
        <CalendarWrapper className="calendar-wrapper" width={width} height={height}>
            <CalendarHead
                onPrev={prevMonth}
                onToday={goToday}
                onNext={nextMonth}
                currentDate={currentDate}
            />
            <CalendarGrid
                className="calendar-grid"
                rows={rows}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={handleSelectedDate}
                calendarEntries={calendarEntries || []}
                isLoggedIn={!!user}
                width="100%"         // 캘린더 전체 너비 조절
                cellHeight={cellHeight}
            />
        </CalendarWrapper>
    );
}

export default Calendar;
