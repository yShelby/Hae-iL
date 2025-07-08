import React, {useState, useEffect} from 'react';
import {getJournalById} from '@api/journalApi';
import {FaStar} from 'react-icons/fa';
import './css/JournalViewer.css';

export const JournalViewer = ({journalId, onEdit, onDelete}) => {
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // journalId가 없으면 API를 호출 x
        if (!journalId) return;

        // 비동기 API 호출을 처리하기 위해 async 함수를 선언
        const fetchJournal = async () => {
            setLoading(true);
            setError(null); // 새로운 데이터를 불러오기 전에 에러 상태를 초기화
            try {
                // API를 호출하여 특정 ID의 저널 데이터를 가져옵니다.
                const data = await getJournalById(journalId);
                setJournal(data); // 성공 시, 응답 데이터를 state에 저장
            } catch (err) {
                // 에러 발생 시, 콘솔에 에러를 기록하고 사용자에게 보여줄 에러 메시지를 설정
                console.error("저널 상세 정보 로딩 실패:", err);
                setError('저널을 불러오는 데 실패했습니다.');
                setJournal(null); // 기존에 보여주던 데이터가 있다면 비웁니다.
            } finally {
                // API 호출 성공/실패 여부와 관계없이 로딩 상태를 false로 변경
                setLoading(false);
            }
        };
        fetchJournal();
    }, [journalId]);

    // ⭐ 별점 UI를 렌더링하는 유틸 함수
    const renderStars = (rating = 0) => {
        return Array.from({length: 5}, (_, index) => (
            <FaStar key={index} color={index < rating ? '#f1c40f' : '#e0e0e0'}/>
        ));
    };

    // 📄 상태별 조건 렌더링 처리
    if (loading) return <div className="status-message">로딩 중...</div>;
    if (error) return <div className="status-message">{error}</div>;
    if (!journal) return <div className="status-message">저널을 찾을 수 없습니다.</div>;

    return (
        <div className="journal-viewer-container">
            {/* 🧾 제목, 별점, 날짜 */}
            <div className="viewer-header">
                <h2 className="viewer-title">{journal.title}</h2>
                <div className="viewer-rating">{renderStars(journal.rating)}</div>
                <p className="viewer-date">
                    {journal.journalDate
                        ? new Date(journal.journalDate).toLocaleDateString()
                        : '날짜 미지정'}
                </p>
            </div>

            {/* 📜 본문 내용 */}
            <div className="viewer-content">
                {journal.content}
            </div>

            {/* 🛠 수정/삭제 버튼 (콜백은 부모에서 전달) */}
            <div className="viewer-actions">
                <button onClick={onEdit} className={"btn edit-btn"}>수정</button>
                <button onClick={onDelete} className={"btn delete-btn"}>삭제</button>
            </div>
        </div>
    );
};
