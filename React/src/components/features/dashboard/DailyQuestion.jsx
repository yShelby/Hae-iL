import {useAuth} from "@shared/context/AuthContext.jsx";
import "./css/DailyQuestion.css";
import {useNavigate} from "react-router-dom";
import {FaSyncAlt} from "react-icons/fa";
import {useQuestion} from "@shared/context/QuestionContext.jsx";
import {format} from "date-fns";

const DailyQuestion = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const {question, isLoading, refreshQuestion} = useQuestion();

    /**
     *  질문 클릭 시, 오늘 날짜의 일기 작성 페이지로 이동
     */
    const handleQuestionClick = () => {
        if (!question || question.includes('실패')) return;
        const today = format(new Date(), 'yyyy-MM-dd'); // 오늘 날짜를 'YYYY-MM-DD' 형식으로
        navigate(`/diary/date/${today}`);
    };

    const renderContent = () => {
        if (authLoading || (isLoading && !question)) {
            return <div className="status-text">오늘의 질문 : 로딩 중...</div>;
        }
        if (!user) {
            return <div className="status-text">오늘의 질문 : 로그인 후 질문에 답변해보세요.</div>;
        }
        return (
            <p className="question-text" onClick={handleQuestionClick} title="클릭하여 일기 작성하기">
                오늘의 질문 : {question}
            </p>
        );
    };

    return (
        <div className="today-question-container">
            {renderContent()}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (user) { // 클릭 로직은 여전히 로그인 상태에서만 동작
                        refreshQuestion();
                    }
                }}
                className="btn-refresh"
                title={user ? "새로운 질문 보기" : "로그인 후 사용 가능"}
                // 로그인하지 않았거나, 질문을 로딩 중일 때 버튼을 비활성화
                disabled={!user || isLoading}
            >
                <FaSyncAlt className={isLoading ? 'rotating' : ''} />
            </button>
        </div>
    );
};

export default DailyQuestion;