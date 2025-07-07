import "./css/JournalWritePage.css";
import {useNavigate} from "react-router-dom";
import {createJournal} from "@api/journalApi.js";

const JournalWritePage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await createJournal(formData);
            alert('저널이 성공적으로 등록되었습니다.');
            navigate('/journal'); // 저장이 성공하면 목록 페이지로 이동
        } catch (error) {
            // API에서 throw한 에러 객체에서 메시지를 추출하여 표시
            const errorMessages = Object.values(error).join('\n');
            alert(`저장 중 오류가 발생했습니다:\n${errorMessages}`);
        }
    };

    return (
        <div className="journal-write-page-container">
            <h1 className="journal-write-page-title">새 저널 작성</h1>
            <JournalForm onSubmit={handleSubmit} />
        </div>
    );
}

export default JournalWritePage;