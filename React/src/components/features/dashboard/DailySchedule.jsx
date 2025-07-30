import {useEffect, useMemo, useState} from "react";
import {DAILY_MISSIONS, MISSION_NAV_PATHS} from "@features/dashboard/constants.js";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {getTodayTodoStatus} from "@api/todoApi.js";
import "./css/DailySchedule.css";
import {useNavigate} from "react-router-dom";

const DailySchedule = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // 미션 완료 상태와 데이터 로딩 상태를 관리
    const [missionStatus, setMissionStatus] = useState({});
    const [isMissionLoading, setIsMissionLoading] = useState(true);

    /**
     * 모든 미션이 완료되었는지 여부를 계산하는 Memoized 값
     * missionStatus 객체가 변경될 때만 재계산된다
     */
    const allMissionsComplete = useMemo(() => {
        // missionStatus 객체가 비어있으면(초기 로딩) false를 반환
        if (Object.keys(missionStatus).length === 0) return false;

        // DAILY_MISSIONS 배열의 모든 미션에 대해 missionStatus의 값이 true인지 확인
        return DAILY_MISSIONS.every(mission => missionStatus[mission.id] === true);
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
            }else {
                // [추가] 비로그인 상태일 때 기존 미션 상태를 초기화
                // 이유: 로그아웃 후에도 이전 사용자 정보가 화면에 남아있는 것을 방지
                setMissionStatus({});
            }
            setIsMissionLoading(false);
        };

        fetchStatus();
    }, [authLoading, user]);

    const getKoreanDateISOString = () => {
        const now = new Date();
        // 현재 로컬 시간을 UTC 시간으로 변환 (getTimezoneOffset은 분 단위로 UTC와의 차이를 반환하므로 밀리초로 변환)
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        // 한국 시간(UTC+9) 오프셋을 밀리초로 정의합니다.
        const KST_OFFSET = 9 * 60 * 60 * 1000;
        // UTC 시간에 KST 오프셋을 더해 한국 시간대의 Date 객체를 생성
        const koreanTime = new Date(utc + KST_OFFSET);
        // ISO 형식(YYYY-MM-DDTHH:mm:ss.sssZ)으로 변환 후, 날짜 부분만 잘라내어 반환
        return koreanTime.toISOString().slice(0, 10);
    };

    // 클릭 시 해당 페이지로 이동시키는 함수
    const handleNavigate = (missionId) => {
        const path = MISSION_NAV_PATHS[missionId];
        if (path) {
            // 'diary' 또는 'journal' 페이지로 이동할 때 오늘 날짜 정보를 함께 전달
            if (missionId === 'diary') {
                const today = getKoreanDateISOString();
                navigate(`/diary/date/${today}`);
            } else if (missionId === 'journaling') {
                // 저널링의 경우, 특정 날짜로 이동하는 로직이 필요하다면 여기에 추가 가능
                // 현재는 state로 전달하는 방식을 유지
                const today = getKoreanDateISOString();
                navigate(path, { state: { date: today } });
            } else {
                navigate(path);
            }
        } else {
            console.warn(`'${missionId}'에 대한 경로가 지정되지 않았습니다.`);
        }
    };

    // [수정] '오늘의 일정' 중앙 위치시키기 위해서 div 추가
    return (
        <div className="daily-schedule-wrapper">
            <div className="daily-mission-container">
                <div className="mission-label"></div>
                <div className="mission-memo-paper">
                    <div className="mission-list-content">
                        <h3 className="mission-title">오늘의 일정</h3>

                        {/*
                          [수정] 로딩 및 로그인 상태에 따른 조건부 렌더링 로직을 여기에 직접 통합
                          이유: 항상 '오늘의 일정' 제목을 먼저 표시한 후, 그 아래에 로딩 상태,
                               로그인 여부에 따른 적절한 UI를 보여주기 위한 구조 변경
                        */}
                        {authLoading || isMissionLoading ? (
                            <div className="loading-text">로딩 중...</div>
                        ) : !user ? (
                            <div className="login-prompt">로그인 후<br/>이용해주세요.</div>
                        ) : (
                            <>
                                {allMissionsComplete && (
                                    <div className="all-complete-message">오늘의 일정을 모두 완료했습니다!</div>
                                )}
                                <ul className="mission-list">
                                    {DAILY_MISSIONS.map((mission) => (
                                        <li key={mission.id} className="mission-item" onClick={() => handleNavigate(mission.id)}>
                                            <div className={`status-icon ${missionStatus[mission.id] ? 'completed' : ""}`}>
                                                {missionStatus[mission.id] && '✓'}
                                            </div>
                                            <span className={`mission-text ${missionStatus[mission.id] ? 'completed' : ""}`}>
                                                {mission.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailySchedule;
