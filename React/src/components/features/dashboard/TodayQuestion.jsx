import {useAuth} from "@features/auth/AuthContext.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useEffect, useRef, useState} from "react";
import {getTodayQuestionAndAnswer, saveAnswer} from "@api/questionApi.js";
import "./css/TodayQuestion.css";

const TodayQuestion = () => {
    const { user, loading: authLoading } = useAuth();
    const checkLogin = useCheckLogin();

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // 저장 중 상태

    const debounceTimer = useRef(null); // 디바운싱을 위한 타이머 ref

    useEffect(() => {
        if (authLoading) return;

        const fetchData = async () => {
            if (user) {
                try {
                    const { questionText, answerText } = await getTodayQuestionAndAnswer();
                    setQuestion(questionText);
                    setAnswer(answerText || ''); // 답변이 null이면 빈 문자열로 초기화
                } catch (e) {
                    setQuestion('질문을 불러오는 데 실패했습니다.');
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [authLoading, user]);

    // 답변이 변경될 때마다 디바운싱을 적용하여 자동 저장
    useEffect(() => {
        // 로딩 중이거나, 로그인하지 않았거나, 질문이 없는 경우에는 저장 로직을 실행하지 않음
        if (isLoading || !user || !question) return;

        // 이전 타이머가 있다면 취소
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // 1.5초 후에 저장 로직 실행
        debounceTimer.current = setTimeout(async () => {
            if (!checkLogin()) return;
            setIsSaving(true);
            try {
                await saveAnswer(answer);
            } catch (error) {
                console.error("답변 저장 실패:", error);
            } finally {
                setIsSaving(false);
            }
        }, 1500); // 1.5초

        // 컴포넌트 언마운트 시 타이머 정리
        return () => {
            clearTimeout(debounceTimer.current);
        };
    }, [answer, user, question, isLoading, checkLogin]);

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const renderContent = () => {
        if (authLoading || isLoading) {
            return <div className="status-text">로딩 중...</div>;
        }
        if (!user) {
            return <div className="status-text">로그인 후 질문에 답변해보세요.</div>;
        }
        return (
            <>
                <p className="question-text">{question}</p>
                <textarea
                    className="answer-textarea"
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="이곳에 답변을 입력하세요..."
                />
                <div className="save-status">
                    {isSaving ? '저장 중...' : '모든 내용이 자동으로 저장됩니다.'}
                </div>
            </>
        );
    };

    return (
        <div className="today-question">
            <h4 className="title">오늘의 질문</h4>
            {renderContent()}
        </div>
    );
};

export default TodayQuestion;