import React, {useState, useEffect} from 'react';
import {getJournalById} from '@api/journalApi';
import {FaStar} from 'react-icons/fa';
import './css/JournalViewer.css';

export const JournalViewer = ({journalId, onEdit, onDelete, initialData}) => {
    const [journal, setJournal] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState(null);

    useEffect(() => {
        // // journalId가 없으면 API를 호출 x
        // if (!journalId) return;

        // 수정 - initialData가 없을 때만 서버에서 데이터를 새로 불러옵니다.
        if (journalId && !initialData) {
            setLoading(true);
            const fetchJournal = async () => {
                try {
                    const data = await getJournalById(journalId);
                    setJournal(data);
                } catch (e) {
                    setError('저널을 불러오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };
            fetchJournal();
        }
        // 추가 - initialData가 변경될 경우(예: 다른 글을 저장한 직후)를 대비해
        // journal 상태를 업데이트하고 로딩 상태를 false로 유지
        else if (initialData) {
            setJournal(initialData);
            setLoading(false);
        }
    }, [journalId, initialData]); // initialData도 의존성 배열에 추가

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
