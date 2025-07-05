import React, {useEffect} from 'react';
import {formatDateToString, addDays, getStartOfWeek} from '@shared/utils/dateUtils.js';

export default function TimelineView({ data = [], selectedDate, onSelectDate }) {
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    const startOfWeek = getStartOfWeek(baseDate);

    // 월~일 날짜 배열 생성
    const daysToShow = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfWeek, i);
        return formatDateToString(date);
    });

    // 날짜별 데이터 그룹핑
    const grouped = {};
    if (Array.isArray(data)) {
        data.forEach(item => {
            // item.date가 문자열일 경우 Date 객체로 변환 후 formatDateToString으로 포맷 통일
            const rawDate = typeof item.date === 'string' ? new Date(item.date) : item.date;
            const dateKey = formatDateToString(rawDate);

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(item);
        });
    }
    const selectedDateStr = selectedDate ? formatDateToString(new Date(selectedDate)) : null;

    // console.log('🧪 grouped', grouped);
    // console.log('🧪 selectedDateStr', selectedDateStr);
    // console.log('🧪 daysToShow', daysToShow);
    // useEffect(() => {
    //     console.log('📦 raw data from DB:', data);
    // }, [data]);

    return (
        <div className="timeline-wrapper">
            {daysToShow.map(date => {
                const isActive = date === selectedDate;
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
                        onClick={() => onSelectDate(date)}
                    >
                        <h4>{date}</h4>

                        <div className="icon-row">
                            {hasDiary && <span title="일기 기록 있음">📝</span>}
                            {hasSleep && <span title="수면 기록 있음">💤</span>}
                            {hasExercise && <span title="운동 기록 있음">🏋️</span>}
                            {hasMeal && <span title="식사 기록 있음">🍽️</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
