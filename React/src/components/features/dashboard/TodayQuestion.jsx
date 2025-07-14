import {useAuth} from "@shared/context/AuthContext.jsx";
import "./css/TodayQuestion.css";
import {useNavigate} from "react-router-dom";
import {FaSyncAlt} from "react-icons/fa";
import {useQuestion} from "@shared/context/QuestionContext.jsx";
import {format} from "date-fns";

const TodayQuestion = () => {
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
            return <div className="status-text">로딩 중...</div>;
        }
        if (!user) {
            return <div className="status-text">로그인 후 질문에 답변해보세요.</div>;
        }
        return (
            <div className="question-content-wrapper">
                <p className="question-text" onClick={handleQuestionClick} title="클릭하여 일기 작성하기">
                    {question}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // p 태그의 클릭 이벤트 전파 방지
                        refreshQuestion(); // Context의 함수 호출
                    }}
                    className="btn-refresh"
                    title="새로운 질문 보기"
                    disabled={isLoading}
                >
                    <FaSyncAlt className={isLoading ? 'rotating' : ''} />
                </button>
            </div>
        );
    };

    return (
        <div className="today-question-container">
            <h4 className="title">오늘의 질문</h4>
            {renderContent()}
        </div>
    );
};

export default TodayQuestion;