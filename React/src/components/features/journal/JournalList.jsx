import {useEffect, useState} from "react";
import {getJournals} from "@api/journalApi.js";
import "./css/JournalList.css";
import {JournalItem} from "@features/journal/JournalItem.jsx";

export const JournalList = ({category, onItemSelect, user, selectedJournalId, refreshKey}) => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 로그인한 사용자 없으면 목록 초기화하고 로딩 중단
        if (!user) {
            setLoading(false);
            setJournals([]);
            return;
        }
        // 데이터 로딩 시작
        setLoading(true);
        getJournals(category)
            .then(data => setJournals(data)) // 성공 시 목록 상태 업데이트
            .catch(() => setError("데이터를 불러오는 데 실패했습니다.")) // 실패 시 에러 상태 설정
            .finally(() => setLoading(false)); // 완료 후 로딩 상태 해제
    }, [category, user, refreshKey]);
    // refreshKey가 변경될 때마다 목록을 강제로 다시 불러오기 위해 의존성 배열에 추가

    // 로그인 전용 UI 및 상태별 조건부 렌더링 처리
    if (!user) return <div className="status-message">로그인 후 이용해주세요.</div>;
    if (loading) return <div className="status-message">로딩 중...</div>;
    if (error) return <div className="status-message">{error}</div>;
    if (journals.length === 0) return <div className="status-message">작성된 기록이 없습니다.</div>;

    // 저널 목록 렌더링: 각 항목 클릭 시 부모로 선택 이벤트 전달
    return (
        <div className="journal-list-container">
            {journals.map((journal) => (
                <JournalItem
                    key={journal.id}
                    journal={journal}
                    onSelect={onItemSelect}
                    isSelected={journal.id === selectedJournalId}
                />
            ))}
        </div>
    );
};
