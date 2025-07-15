import React, {useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import { format } from "date-fns";
import Tooltip from "@shared/UI/Tooltip.jsx";
// import MoodWave from "./MoodWave"; // 감정 도형 컴포넌트(추후 구현)

const CalendarGridContainer = styled.div`
    width: ${({ width }) => width || "420px"};
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 20px;
`;

const WeekHeader = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 8px;
    color: #888;
    font-weight: 500;
    font-size: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

const DayCell = styled.div`
    height: ${({ cellHeight }) => cellHeight || "60px"};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: ${({ isToday }) => (isToday ? "#f0f4ff" : "transparent")};
    font-weight: ${({ isToday }) => (isToday ? "bold" : "normal")};
    border: ${({ isSelected }) => (isSelected ? "2px solid #393E75" : "none")};
    color: ${({ isCurrentMonth }) => (isCurrentMonth ? "#222" : "#ccc")};
    opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.5)};
    cursor: pointer;
    transition: border 0.2s;
`;

function CalendarGrid({
                          rows,
                          currentDate,
                          calendarEntries,
                          isLoggedIn,
                          selectedDate,
                          onSelectDate,
                          width = "420px",
                          cellHeight = "60px"
                      }) {
    const [tooltip, setTooltip] = useState({visible: false, x: 0, y: 0, title: ""});

    const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
    const navigate = useNavigate();

    function handleMouseEnter(e, entry) {
        if (!entry) return;
        setTooltip({
            visible: true,
            x: e.clientX + 12, // 마우스 위치 기준 약간 오른쪽/아래로
            y: e.clientY + 12,
            title: entry.title
        });
    }
    function handleMouseMove(e, entry) {
        if (!entry) return;
        setTooltip(prev => ({
            ...prev,
            x: e.clientX + 12,
            y: e.clientY + 12
        }));
    }
    function handleMouseLeave() {
        setTooltip({
            visible: false,
            x: 0,
            y: 0,
            title: ""
        });
    }

    // 날짜별로 데이터 찾기 (YYYY-MM-DD 포맷)
    const entryMap = new Map();
    calendarEntries.forEach(entry => {
        // diaryDate가 문자열인 경우, 앞 10자리만 사용 (YYYY-MM-DD)
        const dateKey = format(new Date(entry.diaryDate), 'yyyy-MM-dd');
        entryMap.set(dateKey, entry);
    });

    // 더블클릭 이벤트 핸들러
    function handleDoubleClick(date) {
        if (!isLoggedIn) return; // 비로그인 분기는 추후 추가
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = entryMap.get(dateStr);

        if (entry && entry.diaryId) {
            // 작성된 일기 상세 페이지로 이동
            navigate(`/diary/${entry.diaryId}`);
        } else {
            // 일기 작성 페이지로 이동
            navigate(`/diary/date/${dateStr}`);
        }
    }

    const moodColorMap = [
        { score: 100, color: "#393E75" },
        { score: 90, color: "#4D4186" },
        { score: 80, color: "#644C80" },
        { score: 70, color: "#7F548F" },
        { score: 60, color: "#8C548F" },
        { score: 50, color: "#9D5E98" },
        { score: 40, color: "#A96789" },
        { score: 30, color: "#B5698F" },
        { score: 20, color: "#C56A8B" },
        { score: 10, color: "#CB6A87" },
        { score: 0, color: "#DC7A91" },
        { score: -10, color: "#EC8992" },
        { score: -20, color: "#FE968C" },
        { score: -30, color: "#FE978E" },
        { score: -40, color: "#FE998E" },
        { score: -50, color: "#FE9C8D" },
        { score: -60, color: "#FEA88D" },
        { score: -70, color: "#FEAB8E" },
        { score: -80, color: "#FEBB8E" },
        { score: -90, color: "#FFCD9A" },
        { score: -100, color: "#FFE5AE" }
    ];

    function getMoodColor(score) {
        // 점수와 가장 가까운 색상 반환
        let closest = moodColorMap[0];
        for (const item of moodColorMap) {
            if (Math.abs(score - item.score) < Math.abs(score - closest.score)) {
                closest = item;
            }
        }
        return closest.color;
    }


    return (
        <CalendarGridContainer width={width}>
            <WeekHeader>
                {weekDays.map((d) => (
                    <div key={d} style={{ textAlign: "center" }}>{d}</div>
                ))}
            </WeekHeader>
            <Grid>
                {rows.flat().map((date, idx) => {
                    // 날짜를 YYYY-MM-DD 문자열로 변환
                    const dateStr = format(date, "yyyy-MM-dd");
                    const entry = entryMap.get(dateStr);
                    const bgColor =
                        entry && typeof entry.moodScore === "number"
                            ? getMoodColor(entry.moodScore)
                            : "transparent";

                    return (
                        <DayCell
                            key={idx}
                            isToday={date.toDateString() === new Date().toDateString()}
                            isSelected={selectedDate && date.toDateString() === selectedDate.toDateString()}
                            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                            cellHeight={cellHeight}
                            onClick={() => onSelectDate(date)}
                            onDoubleClick={() => handleDoubleClick(date)}
                            onMouseEnter={e => handleMouseEnter(e, entry)}
                            onMouseMove={e => handleMouseMove(e, entry)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                background: bgColor,
                                transition: "background 0.3s"
                            }}
                        >
                            {date.getDate()}
                            {/* 로그인 상태이고, 해당 날짜에 entry가 있을 때 감정 도형 등 표시 */}
                            {/*{entry && <span>{entry.title}</span>}*/}
                        </DayCell>
                    );
                })}
            </Grid>
            <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
                {tooltip.title}
            </Tooltip>
        </CalendarGridContainer>
    );
}

export default CalendarGrid;
