import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import { format } from "date-fns";
import Tooltip from "@shared/UI/Tooltip.jsx";
import {getMoodColor, getMoodWaveColors, getMoodBackgroundColor} from "@shared/utils/moodColor.jsx";
import { motion } from "framer-motion";

// 애니메이션용 path 배열
const wavePathsStatic = [
    "M0,71 Q14,68,25,78 Q40,92 53,84 Q69,74 87,80 Q92,82 100,79 L100,120 L0,120Z",
    "M0,83 Q7,88 18,81 Q38,72 55,84 Q71,94 84,83 Q92,77 100,79 L100,120 L0,120Z",
    "M0,95 Q9,93 20,102 Q41,117 61,100 Q73,91 87,103 Q94,109 100,108 L100,120 L0,120Z",
];

const wavePathsArray = [
    [ // top wave
        "M0,71 Q14,68,25,78 Q40,92 53,84 Q69,74 87,80 Q92,82 100,79 L100,120 L0,120Z",
        "M0,68 Q14,80 25,75 Q40,66 53,81 Q69,95 87,82 Q92,78 100,80 L100,120 L0,120Z",
        "M0,73 Q14,69 25,76 Q40,86 53,79 Q69,71 87,80 Q92,83 100,81 L100,120 L0,120Z",
        "M0,66 Q14,77 25,72 Q40,62 53,76 Q69,90 86,80 Q92,75 100,79 L100,120 L0,120Z",
        "M0,72 Q14,67 25,71 Q40,78 53,68 Q69,57 86,72 Q92,78 100,79 L100,120 L0,120Z",
        "M0,66 Q14,79 25,73 Q40,64 53,70 Q69,80 86,70 Q92,66 100,68 L100,120 L0,120Z",
        "M0,71 Q14,68,25,78 Q40,92 53,84 Q69,74 87,80 Q92,82 100,79 L100,120 L0,120Z",

    ],
    [ // middle wave
        "M0,83 Q7,88 18,81 Q38,72 55,84 Q71,94 84,83 Q92,77 100,79 L100,120 L0,120Z",
        "M0,90 Q7,80 18,85 Q38,92 55,87 Q71,81 84,89 Q92,95 100,87 L100,120 L0,120Z",
        "M0,85 Q7,90 18,87 Q38,78 55,90 Q71,98 84,91 Q92,86 100,87 L100,120 L0,120Z",
        "M0,92 Q7,85 18,89 Q38,96 55,92 Q71,86 84,90 Q92,94 100,87 L100,120 L0,120Z",
        "M0,84 Q7,87 18,85 Q38,76 55,88 Q71,98 84,92 Q92,88 100,90 L100,120 L0,120Z",
        "M0,89 Q7,80 18,86 Q38,94 55,89 Q71,81 84,92 Q92,97 100,87 L100,120 L0,120Z",
        "M0,83 Q7,88 18,83 Q38,72 55,84 Q71,94 84,83 Q92,77 100,80 L100,120 L0,120Z",
    ],
    [ // bottom wave
        "M0,96 Q9,91 17,98 Q33,113 53,100 Q66,93 80,102 Q92,111 100,107 L100,120 L0,120Z",
        "M0,95 Q5,91 13,98 Q28,110 48,100 Q60,93 73,102 Q88,111 100,107 L100,120 L0,120Z",
        "M0,95 Q9,105 17,98 Q33,88 53,104 Q66,114 80,104 Q92,94 100,95 L100,120 L0,120Z",
        "M0,94 Q5,88 13,94 Q28,105 48,98 Q60,93 73,102 Q92,115 100,109 L100,120 L0,120Z",
        "M0,96 Q9,92 17,98 Q33,108 53,96 Q66,88 80,99 Q92,108 100,96 L100,120 L0,120Z",
        "M0,95 Q5,100 13,95 Q28,83 48,98 Q60,105 73,100 Q88,94 100,105 L100,120 L0,120Z",
        "M0,96 Q9,91 17,98 Q33,113 53,100 Q66,93 80,102 Q92,111 100,107 L100,120 L0,120Z",
    ]
];



const CalendarGridContainer = styled.div`
    width: ${({ width }) => width || "420px"};
    height: 100%;
    //background: #f0f0f0;
    border-radius: 8px;
    //box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 10px 20px;
`;

const WeekHeader = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 8px;
    color: var(--primary-color);
    font-weight: 500;
    font-size: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-content: center;
    align-items: center;
    gap: 5px;
    //font-size: 0.7rem;
`

const DayCell = styled.div`
    height: ${({ cellHeight }) => cellHeight || "60px"};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: ${({ isToday }) => (isToday ? "none" : "#fff")};
    font-weight: ${({ isToday }) => (isToday ? "bold" : "normal")};
    border: ${({ isSelected }) => (isSelected ? "3px inset #DDD" : "transparent")};
    box-shadow: ${({ isSelected }) => (isSelected ? "none" :"2px 2px 2px 0px #999")};
    opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.55)};
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
                          cellHeight = "50px"
                      }) {

    // 시간 상태
    const [now, setNow] = useState(new Date());
    // 실시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60 * 1000);
        return () => clearInterval(timer);
    }, []);
    const tooltipTimeout = useRef();


    const [tooltip, setTooltip] = useState({visible: false, x: 0, y: 0, title: ""});

    const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
    const navigate = useNavigate();

    function getIsDayTime(dateObj = new Date()) {
        const hour = dateObj.getHours();
        return hour >= 7 && hour <= 18;
        // return hour < 7 || hour > 18;
    }

    const isDayTime = getIsDayTime(now);

    function getCellBgColor() {
        return isDayTime ? "rgb(220 137 145 /0.55)" : "rgb(57 62 117 /0.35)";
    }

    function handleMouseEnter(e, entry) {
        if (!entry) return;
        tooltipTimeout.current = setTimeout(() => {
            setTooltip({
                visible: true,
                x: e.clientX + 12, // 마우스 위치 기준 약간 오른쪽/아래로
                y: e.clientY + 12,
                title: entry.title
            });
        }, 500)
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
        tooltipTimeout.current = setTimeout(() => {
            setTooltip({
                visible: false,
                x: 0,
                y: 0,
                title: ""
            });
        })
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

        onSelectDate && onSelectDate(date);  // 날짜 상태 반영
        navigate(`/diary/date/${dateStr}`);
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
                    // moodScore 있을 때만 색상 적용
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                    const bgColor = entry && typeof entry.moodScore === "number"
                        ? getMoodBackgroundColor(entry.moodScore)
                        : getCellBgColor();
                    // moodScore 있으면 3색상 추출
                    const moodWaves = entry && typeof entry.moodScore === "number"
                        ? getMoodWaveColors(entry.moodScore)
                        : null;
                    // .sunMoon 배경색 결정
                    const pathColor = isDayTime ? "#FE978E" : "#FFF6E5";
                    const today = date.toDateString() === new Date().toDateString();

                    return (
                        <DayCell
                            key={idx}
                            isToday={today}
                            isSelected={isSelected}
                            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                            cellHeight={cellHeight}
                            onClick={() => onSelectDate(date)}
                            onDoubleClick={() => handleDoubleClick(date)}
                            onMouseEnter={e => handleMouseEnter(e, entry)}
                            onMouseMove={e => handleMouseMove(e, entry)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                position: "relative",
                                background: bgColor,
                                transition: "background 0.3s",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            <div className={"sunMoon"}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",alignItems: "center",
                                    width: today ? "32%" : "23%", height: today ? "32%" : "23%",
                                    border: today ? "5px dotted magenta" : "none",
                                    borderRadius: "50%",
                                    paddingTop: "1px",
                                    marginBottom: "33%",
                                    backgroundColor: entry ? "rgba(255,246,229,0.75)" : "transparent",
                                    color: "#393E75",
                                    zIndex: 5,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: entry ? "0.6rem" : "0.85rem",
                                        lineHeight: isSelected ? "100%" : "inherit"
                                }}
                                >
                                    {date.getDate()}
                                </div>
                            </div>
                                <div style={{
                                    position: "absolute",
                                    left: 0, right: 0, bottom: 0, height: "100%",
                                    pointerEvents: "none",
                                    zIndex: 1,
                                }}>
                                    {[0, 1, 2].map(i => {
                                        const staticPath = wavePathsStatic[i];
                                        const frames = wavePathsArray[i];
                                        const durations = [4.1, 3.2, 2.3];

                                        if (moodWaves) {
                                            {/* 가장 낮은 점수(색)가 위로 오게 순서 뒤집기 */}
                                            const wave = moodWaves.slice().reverse().reverse()[i];
                                            return isSelected ? (
                                                <motion.svg  key={`wave-animated-${i}`}
                                                             viewBox="0 0 100 120"
                                                             preserveAspectRatio="none"
                                                             style={{
                                                                 position: "absolute",
                                                                 bottom: 0,
                                                                 left: 0,
                                                                 width: "100%",
                                                                 height: "100%",
                                                             }}>
                                                    <motion.path
                                                        fill={wave.color}
                                                        initial={{ d: frames[0] }}
                                                        animate={{ d: [frames[0], frames[1], frames[2], frames[3], frames[4], frames[5], frames[6]] }}
                                                        transition={{
                                                            duration: durations[i],
                                                            repeat: Infinity,
                                                            repeatType: "reverse",
                                                            ease: "linear",
                                                            delay: i * 0.3,
                                                        }}
                                                    />
                                                </motion.svg> ) : (
                                                <svg
                                                    key={`wave-static-${i}`}
                                                    viewBox="0 0 100 120"
                                                    preserveAspectRatio="none"
                                                    style={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                    }}>
                                                    <path
                                                        d={staticPath}
                                                        fill={wave.color}
                                                    />
                                                </svg>
                                            );
                                        }

                                        // moodScore 없는 경우 -> default 디자인
                                        return (
                                            <svg
                                                key={`default-wave-${i}`}
                                                viewBox="0 0 100 120"
                                                preserveAspectRatio="none"
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            >
                                                <path
                                                    d={staticPath}
                                                    fill={pathColor}
                                                    fillOpacity={0.15}
                                                    stroke="rgb(225 225 225 / 0.90)"
                                                    strokeWidth={"1px"}
                                                />
                                            </svg>
                                        );
                                    })}
                                {/*{entry && <span>{entry.title}</span>}*/}
                                </div>
                        </DayCell>
                    )}
                )}
            </Grid>
            <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
                {tooltip.title}
            </Tooltip>
        </CalendarGridContainer>
    );
}

export default CalendarGrid;
