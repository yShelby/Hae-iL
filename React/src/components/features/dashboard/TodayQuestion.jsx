import {useAuth} from "@features/auth/AuthContext.jsx";
import {useEffect, useState} from "react";
import {deleteAnswerAPI, getTodayQuestionAndAnswer, saveAnswer} from "@api/questionApi.js";
import "./css/TodayQuestion.css";
import {showToast} from "@shared/UI/Toast.jsx";
import toast from "react-hot-toast";

const TodayQuestion = () => {
    const { user, loading: authLoading } = useAuth();

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // 저장/수정/삭제 중
    const [hasExistingAnswer, setHasExistingAnswer] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        const fetchData = async () => {
            if (user) {
                try {
                    const { questionText, answerText } = await getTodayQuestionAndAnswer();
                    setQuestion(questionText);
                    setAnswer(answerText || ''); // 답변이 null이면 빈 문자열로 초기화
                    setHasExistingAnswer(!!answerText); // 서버에서 받아온 답변 텍스트의 존재 여부로 상태를 설정
                } catch (e) {
                    setQuestion('질문을 불러오는 데 실패했습니다.');
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [authLoading, user]);

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    // 저장 또는 수정 핸들러
    const handleSaveOrUpdate = async () => {
        setIsProcessing(true);
        const promise = saveAnswer(answer);

        showToast.promise(promise, {
            loading: '저장 중...',
            success: hasExistingAnswer ? '답변이 수정되었습니다.' : '답변이 저장되었습니다.',
            error: '처리 중 오류가 발생했습니다.',
        });

        try {
            await promise;
            setHasExistingAnswer(true); // 성공 시 '수정/삭제' 모드로 변경
        } catch (e) {
            // 에러는 토스트가 자동으로 처리
        } finally {
            setIsProcessing(false);
        }
    };

    // 삭제 핸들러
    const handleDelete = async () => {
        toast((t) => (
            <div className="confirm-toast">
                <p>정말 삭제하시겠습니까?</p>
                <div className="confirm-buttons">
                    <button
                        className="btn-confirm-delete"
                        onClick={() => {
                            toast.dismiss(t.id); // 확인 토스트 닫기
                            executeDelete();   // 실제 삭제 로직 실행
                        }}
                    >
                        삭제
                    </button>
                    <button className="btn-confirm-cancel" onClick={() => toast.dismiss(t.id)}>
                        취소
                    </button>
                </div>
            </div>
        ), {
            position: 'top-center', // ✅ 위치 설정
            style: {
                border: 'none', // ✅ 겉 테두리 제거
                boxShadow: 'none', // ✅ 그림자 제거 (원할 경우)
                padding: 0, // optional: 내부 여백 제거
            }
        });
    };

    // 실제 삭제 로직을 처리하는 함수 (Promise 토스트와 함께)
    const executeDelete = async () => {
        setIsProcessing(true);
        const promise = deleteAnswerAPI();

        showToast.promise(promise, {
            loading: '삭제 중...',
            success: '답변이 삭제되었습니다.',
            error: '삭제 중 오류가 발생했습니다.',
        });

        try {
            await promise;
            setAnswer('');
            setHasExistingAnswer(false); // 성공 시 '저장' 모드로 변경
        } catch (e) {
            // 에러는 토스트가 자동으로 처리
        } finally {
            setIsProcessing(false);
        }
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
                {/* 버튼 조건부 렌더링 */}
                <div className="question-button-container">
                    {hasExistingAnswer ? (
                        <>
                            <button onClick={handleSaveOrUpdate} className="btn-update" disabled={isProcessing}>
                                {isProcessing ? '수정 중...' : '수정'}
                            </button>
                            <button onClick={handleDelete} className="btn-delete" disabled={isProcessing}>
                                {isProcessing ? '삭제 중...' : '삭제'}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleSaveOrUpdate} className="btn-save" disabled={isProcessing}>
                            {isProcessing ? '저장 중...' : '저장'}
                        </button>
                    )}
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