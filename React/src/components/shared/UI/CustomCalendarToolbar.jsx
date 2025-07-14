import React from 'react';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';

const CustomCalendarToolbar = ({ date, onNavigate, label, view, views, onView }) => {
  const year = format(date, 'yyyy년', { locale: ko });
  const month = format(date, 'M월', { locale: ko });

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>이전</button>
        <button type="button" onClick={() => onNavigate('TODAY')}>오늘</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>다음</button>
      </span>
      <span className="rbc-toolbar-label">
        <span className="calendar-year">{year}</span>
        <span className="calendar-month">{month}</span>
      </span>
      <span className="rbc-btn-group">
        {views.map((name) => (
          <button
            key={name}
            className={view === name ? 'rbc-active' : ''}
            onClick={() => onView(name)}
          >
            {name === 'month' ? '월' : name === 'week' ? '주' : name === 'day' ? '일' : '일정'}
          </button>
        ))}
      </span>
    </div>
  );
};

export default CustomCalendarToolbar;
