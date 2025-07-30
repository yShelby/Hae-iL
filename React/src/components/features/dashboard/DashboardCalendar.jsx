import {useEffect, useState} from "react";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {getRecordDate} from "@api/recordApi.js";
import "./css/DashboardCalendar.css";

const DashboardCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [recordDate, setRecordDate] = useState({});

    // 렌더링 시마다 오늘 날짜를 상수로 계산하여 항상 최신 상태를 유지
    // 이렇게 하면 자정이 지나도 새로운 '오늘'을 정확히 인식 가능
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 비교를 위해 시간 정보는 초기화

    const checkLogin = useCheckLogin();
    const {user} = useAuth();
    const navigate = useNavigate();

    // - user 객체가 존재하면 로그인, null이면 비로그인으로 판단하여 데이터를 불러옵니다.
    useEffect(() => {
        const fetchData = async () => {
            if (user) { // user 객체의 존재 여부로 로그인 상태를 확인
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const data = await getRecordDate(year, month);
                setRecordDate(data);
            } else {
                setRecordDate({}); // 로그아웃 상태(user가 null)가 되면 달력의 점들을 초기화
            }
        };
        fetchData();
    }, [currentDate, user]);

    // 이전 달, 다음 달 이동 함수
    const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // 렌더링 로직 (내용은 동일, 스타일 클래스명은 유지)
    const renderHeader = () => (
        <div className={"header"}>
            <button onClick={goToPreviousMonth} aria-label="이전 달로 이동">&lt;</button>
            <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
            <button onClick={goToNextMonth} aria-label="다음 달로 이동">&gt;</button>
        </div>
    );

    const renderDays = () => {
        const days = ['월', '화', '수', '목', '금', '토', '일'];
        return <div className={"days"}>{days.map(day => <div key={day} className={"day"}>{day}</div>)}</div>;
    };

    const renderCells = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < startDay; i++) { cells.push(<div key={`empty-${i}`} className={`${"cell"} ${"empty"}`}></div>); }
        for (let day = 1; day <= daysInMonth; day++) {
            const recordType = recordDate[day];

            // 현재 렌더링 중인 셀의 날짜를 생성
            const cellDate = new Date(year, month, day);
            // 이 날짜가 오늘 이후인지(미래인지) 판별
            const isFuture = cellDate > today;

            // isFuture 값에 따라 클래스 이름을 동적으로 부여
            const cellClassName = `cell ${isFuture ? 'disabled' : ''}`;

            // 날짜 포맷을 미리 만들어 재사용
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            cells.push(
                <div
                    key={day}
                    className={cellClassName}
                    // - 미래 날짜, 기록이 없는 날, 기록이 둘 다 있는 날은 셀 전체 클릭을 막는다.
                    // - 기록이 하나만 있을 때만 셀 전체를 클릭하여 해당 페이지로 이동
                    onClick={() => {
                        if (isFuture || !recordType || recordType === 'both') return;
                        if (checkLogin()) {
                            const path = recordType === 'diary' ? `/diary/date/${formattedDate}` : `/journal?date=${formattedDate}`;
                            navigate(path);
                        }
                    }}
                >
                    <span>{day}</span>
                    <div className={"dots"}>
                        {/* 파란색(일기) 점 */}
                        {(!isFuture && (recordType === 'diary' || recordType === 'both')) && (
                            <div
                                className={`dot diary ${recordType === 'both' ? 'clickable' : ''}`}
                                title="일기 보기"
                                // 기록이 둘 다 있을 때만 이 점에 클릭 이벤트를 부여
                                onClick={(e) => {
                                    if (recordType !== 'both') return;
                                    e.stopPropagation(); // 부모 div의 클릭 이벤트 전파를 막는다.
                                    if (checkLogin()) navigate(`/diary/date/${formattedDate}`);
                                }}
                            ></div>
                        )}
                        {/* 초록색(저널) 점 */}
                        {(!isFuture && (recordType === 'journal' || recordType === 'both')) && (
                            <div
                                className={`dot journal ${recordType === 'both' ? 'clickable' : ''}`}
                                title="저널 보기"
                                // 기록이 둘 다 있을 때만 이 점에 클릭 이벤트를 부여
                                onClick={(e) => {
                                    if (recordType !== 'both') return;
                                    e.stopPropagation(); // 부모 div의 클릭 이벤트 전파를 막는다.
                                    if (checkLogin()) navigate(`/journal?date=${formattedDate}`);
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            );
        }
        return <div className={"cells"}>{cells}</div>;
    };

    return (
        <div className={"dash-calendar"}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default DashboardCalendar;