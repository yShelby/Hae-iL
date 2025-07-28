import React, {forwardRef, useMemo, useRef} from 'react';
import {formatDateToString, addDays, getStartOfWeek, getEndOfWeek} from '@shared/utils/dateUtils.js';
import DatePicker, {registerLocale} from 'react-datepicker';
import ko from 'date-fns/locale/ko'; // 🇰🇷 한글 로케일
import 'react-datepicker/dist/react-datepicker.css';
import '../timeline/css/TimelineView.css'
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useNavigate} from "react-router-dom";
import {Icons} from "@shared/constants/icons.js";
import Button from "@shared/styles/Button.jsx";

registerLocale('ko', ko); // 로케일 등록

export default function TimelineView({ data = [], selectedDate, onSelectDate, isLoggedIn }) {
    const checkLogin = useCheckLogin();
    const navigate = useNavigate();
    const datepickerRef = useRef(null)

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
        navigate(`/diary/date/${date}`, { state: { animationType: 'none' } });
    };

    // 이전 주, 다음 주 이동
    const handlePrevWeek = () => {
        const prevWeekDate = addDays(startOfWeek, -7);
        // onSelectDate && onSelectDate(formatDateToString(prevWeekDate));
        const prevWeekDateString = formatDateToString(prevWeekDate); // YYYY-MM-DD 형식으로 변환
        onSelectDate?.(prevWeekDateString);
        navigate(`/diary/date/${prevWeekDateString}`, { state: { animationType: 'none' } });
    };

    const handleNextWeek = () => {
        const nextWeekDate = addDays(startOfWeek, 7);
        // onSelectDate && onSelectDate(formatDateToString(nextWeekDate));
        const nextWeekDateString = formatDateToString(nextWeekDate); // YYYY-MM-DD 형식으로 변환
        onSelectDate?.(nextWeekDateString);
        navigate(`/diary/date/${nextWeekDateString}`, { state: { animationType: 'none' } });
    };

    // 달력에서 날짜 선택 시 처리
    const handleCalendarChange = (date) => {
        if (!date) return;
        // onSelectDate && onSelectDate(formatDateToString(date));
        const dateString = formatDateToString(date); // YYYY-MM-DD 형식으로 변환
        onSelectDate?.(dateString);
        navigate(`/diary/date/${dateString}`, { state: { animationType: 'none' } });
    };


    return (
        <div className={"timeline-wrapper"}>
            {/* 상단 컨트롤: 주 이동 + 달력 토글 */}
            <div className="timeline-controls">
                <Button variant={"button1"} className="week-range clickable"
                      onClick={() => datepickerRef.current?.setOpen(true)}>
                    {baseDate.getFullYear()}년 {baseDate.getMonth() + 1}월
                </Button>
                <div className="calendar-wrapper">
                    <DatePicker
                        selected={baseDate}
                        onChange={handleCalendarChange}
                        locale="ko"
                        maxDate={new Date()}
                        withPortal
                        showPopperArrow={false}
                        // customInput={<CalendarButton />}
                        ref={datepickerRef}
                        customInput={<></>}
                    />
                </div>
            </div>

            {/* 주간 타임라인 카드 */}
            <div className="timeline-cards">
                <button onClick={handlePrevWeek} className="week-nav-button" aria-label="이전 주" >
                    <Icons.IconChevronLeft size={35} color="var(--primary-color)" />
                </button>
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
                            <h4
                                style={{
                                    color:
                                        new Date(date).getDay() === 0 ? '#F2B5F1' : // 일요일
                                            new Date(date).getDay() === 6 ? '#A2B8D0' : 'var(--primary-color)'// 토요일 or 평일
                                }}
                            >
                                {new Date(date).getDate()}
                            </h4>
                            <div className="card-icons">
                                {isLoggedIn && hasDiary && <span className="diary" title="일기" />}
                                {isLoggedIn && hasSleep && <span className="sleep" title="수면" />}
                                {isLoggedIn && hasExercise && <span className="exercise" title="운동" />}
                                {isLoggedIn && hasMeal && <span className="meal" title="식사" />}
                            </div>
                        </div>
                    );
                })}
                <button onClick={handleNextWeek} className="week-nav-button" aria-label="이전 주" >
                    <Icons.IconChevronRight size={35} color="var(--primary-color)" />
                </button>
            </div>
        </div>
    );
}
