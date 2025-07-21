import React, {forwardRef, useMemo, useRef, useState} from 'react';
import {formatDateToString, addDays, getStartOfWeek, getEndOfWeek} from '@shared/utils/dateUtils.js';
import DatePicker, {registerLocale} from 'react-datepicker';
import ko from 'date-fns/locale/ko'; // 🇰🇷 한글 로케일
import 'react-datepicker/dist/react-datepicker.css';
import '../timeline/css/TimelineView.css'
import {useCheckLogin} from "@/hooks/useCheckLogin.js";

registerLocale('ko', ko); // 로케일 등록

export default function TimelineView({ data = [], selectedDate, onSelectDate, isLoggedIn }) {
    const checkLogin = useCheckLogin();

    // selectedDate가 없으면 오늘 날짜로 초기화
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();

    // 이번 주 월요일 기준
    const startOfWeek = getStartOfWeek(baseDate);
    const endOfWeek = getEndOfWeek(baseDate);

    // 월~일 주간 배열
    const daysToShow = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfWeek, i);
        return formatDateToString(date);
    });

    // 날짜별 데이터 그룹핑
    const grouped = useMemo(() => {
        const result = {};
        if (Array.isArray(data)) {
            data.forEach(item => {
                // ✅ 날짜를 문자열로 직접 사용 (YYYY-MM-DD 가정)
                const dateKey = typeof item.date === 'string'
                    ? item.date.slice(0, 10) // '2025-07-07T12:00:00Z' → '2025-07-07'
                    : formatDateToString(item.date); // '2025-07-07T12:00:00Z' → '2025-07-07'

                if (!result[dateKey]) result[dateKey] = [];
                result[dateKey].push(item);
            });
        }
        return result;
    }, [data]);

    // 클릭 시 해당 날짜를 부모로 전달
    const handleDateClick = (date) => {
        if (!checkLogin()) return; // 로그인 안되어 있으면 알림만 띄움
        onSelectDate && onSelectDate(date);
    };

    // 이전 주, 다음 주 이동
    const handlePrevWeek = () => {
        const prevWeekDate = addDays(startOfWeek, -7);
        onSelectDate && onSelectDate(formatDateToString(prevWeekDate));
    };

    const handleNextWeek = () => {
        const nextWeekDate = addDays(startOfWeek, 7);
        onSelectDate && onSelectDate(formatDateToString(nextWeekDate));
    };

    // 달력에서 날짜 선택 시 처리
    const handleCalendarChange = (date) => {
        if (!date) return;
        onSelectDate && onSelectDate(formatDateToString(date));
    };

    // 버튼을 input 역할로 대체한 커스텀 컴포넌트
    const CalendarButton = forwardRef(({ value, onClick }, ref) => (
        <button type="button" onClick={onClick} ref={ref} aria-label="달력 열기">
            📆
        </button>
    ));

    return (
        <div className="timeline-wrapper">
            {/* 상단 컨트롤: 주 이동 + 달력 토글 */}
            <div className="timeline-controls">
                <button onClick={handlePrevWeek} aria-label="이전 주" >◀</button>
                <span className="week-range">
                    {baseDate.getFullYear()}년 {baseDate.getMonth() + 1}월
                </span>
                <button onClick={handleNextWeek} aria-label="다음 주">▶</button>
                <div className="calendar-wrapper">
                    <DatePicker
                        selected={baseDate}
                        onChange={handleCalendarChange}
                        locale="ko"
                        maxDate={new Date()}
                        withPortal
                        showPopperArrow={false}
                        customInput={<CalendarButton />}
                    />
                </div>
            </div>

            {/* 주간 타임라인 카드 */}
            <div className="timeline-cards">
                {daysToShow.map(date => {
                    const isActive = date === formatDateToString(baseDate);
                    const items = grouped[date] || [];
                    // 각 기록 타입 존재 여부 확인
                    const hasDiary = items.some(item => item.type === 'diary');
                    const hasSleep = items.some(item => item.type === 'sleep');
                    const hasExercise = items.some(item => item.type === 'exercise');
                    const hasMeal = items.some(item => item.type === 'meal');

                    return (
                        <div
                            key={date}
                            className={`timeline-card ${isActive ? 'active' : ''}`}
                            onClick={() => handleDateClick(date)}
                        >
                            <h4>{new Date(date).getDate()}</h4>
                            <div className="card-icons">
                                {isLoggedIn && hasDiary && <span title="일기">📝</span>}
                                {isLoggedIn && hasSleep && <span title="수면">💤</span>}
                                {isLoggedIn && hasExercise && <span title="운동">🏋️</span>}
                                {isLoggedIn && hasMeal && <span title="식사">🍽️</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
