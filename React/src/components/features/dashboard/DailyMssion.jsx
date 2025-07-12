import {useEffect, useMemo, useState} from "react";
import {DAILY_MISSIONS, MISSION_NAV_PATHS} from "@features/dashboard/constants.js";
import {useAuth} from "@features/auth/AuthContext.jsx";
import {getTodayTodoStatus} from "@api/todoApi.js";
import "./css/DailyMission.css";
import {useNavigate} from "react-router-dom";

const DailyMission = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [missionStatus, setMissionStatus] = useState({});
    const [isMissionLoading, setIsMissionLoading] = useState(true);

    // 모든 미션이 완료되었는지 확인하는 로직
    const allMissionsComplete = useMemo(() => {
        // missionStatus 객체에 값이 있고, 모든 미션의 상태가 true인지 확인
        const statuses = Object.values(missionStatus);
        return statuses.length > 0 && statuses.every(status => status === true);
    }, [missionStatus]);

    // 컴포넌트 마운트 시, 오늘 날짜의 미션 완료 상태를 서버에서 불러온다.
    useEffect(() => {
        if (authLoading) {
            return;
        }

        const fetchStatus = async () => {
            if (user) {
                try {
                    const todayStatus = await getTodayTodoStatus();
                    setMissionStatus(todayStatus);
                } catch (e) {
                    console.log("미션 데이터 로딩 중 에러 발생");
                }
            }
            setIsMissionLoading(false);
        };

        fetchStatus();
    }, [authLoading, user]);

    // 클릭 시 해당 페이지로 이동시키는 함수
    const handleNavigate = (missionId) => {
        const path = MISSION_NAV_PATHS[missionId];
        if (path) {
            navigate(path);
        } else {
            console.warn(`'${missionId}'에 대한 경로가 지정되지 않았습니다.`);
        }
    };

    if (authLoading || isMissionLoading) {
        return <div className="daily-mission-container"><h4>오늘의 미션</h4><div>로딩 중...</div></div>;
    }

    return (
        <div className="daily-mission-container">
            <h4 className="title">오늘의 미션</h4>
            {!user ? (
                <div className="login-prompt">로그인 후 이용해주세요.</div>
            ) : allMissionsComplete ? (
                <div className="all-complete-message">🎉 오늘의 미션을 모두 완료했습니다!</div>
            ) : (
                <ul className="mission-list">
                    {DAILY_MISSIONS.map((mission) => (
                        // li 요소에 직접 onClick 이벤트를 추가
                        <li key={mission.id} className="mission-item" onClick={() => handleNavigate(mission.id)}>
                            <div className={`status-icon ${missionStatus[mission.id] ? 'completed' : ''}`}>
                                {missionStatus[mission.id] && '✔'}
                            </div>
                            <span className={`mission-text ${missionStatus[mission.id] ? 'completed' : ''}`}>
                                {mission.text}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DailyMission;
