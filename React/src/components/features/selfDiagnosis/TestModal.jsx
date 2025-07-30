import {useState, useRef, useEffect} from "react";
import "./TestModal.css";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {fetchSelfDiagnosisStatus, submitDiagnosis} from "@api/selfDiagnosisApi.js";


function TestModal({ test, onClose }) {

    const alertTimeout = useRef(null);
    const { user } = useAuth();
    const checkLogin = useCheckLogin();
    const [loading, setLoading] = useState(false);

    const [answers, setAnswers] =useState(Array(test.questions.length).fill(null));
    const [step, setStep] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [alertMsg, setAlertMsg] = useState(false);

    const [resultData, setResultData] = useState(null);

    // 문항별 옵션 결정 (optionMap이 없으면 전체 옵션 배열 사용)
    const optionSetIdx = test.optionMap ? test.optionMap[step] : 0;
    // options 분기 처리
    const currentOptions = Array.isArray(test.options[0]) ? test.options[optionSetIdx] : test.options;

    // 답변 선택 처리 (자동 다음 질문 이동)
    const handleSelect = (idx, val) => {
        const next = [...answers];
        next[idx] = val;
        setAnswers(next);

        // auto slide to next
        if (idx < test.questions.length -1) {
            setIsMoving(true); // setTimeout 중복 호출 부작용 방지
            // 딜레이 후 슬라이드 이동
            setTimeout(() => {
                setStep(idx + 1);
            }, 250);
        }
    };

    // '다음' 버튼 클릭 시
    const handleNext = () => {

        if (answers[step] === null) {
            setAlertMsg(true);

            if (alertTimeout.current) clearTimeout(alertTimeout.current);
            alertTimeout.current = setTimeout(() => {
                setAlertMsg(false);
                alertTimeout.current = null;
            }, 1500); // setTimeout 중복 호출 방지

            // setTimeout(() => setAlertMsg(false), 1500); // 1.5초 후 경고 숨김
            return;
        }

        setStep(s => Math.min(s + 1, test.questions.length - 1));
    };
    // '이전' 버튼 클릭 시
    const handlePrev = () => {
        setStep(s => Math.max(s - 1, 0));
    }

    // 컴포넌트 unmount시 클린업
    useEffect(() => {
        return () => {
            if (alertTimeout.current) {
                clearTimeout(alertTimeout.current);
            }
        };
    }, []);

    // 제출 여부 : 모든 문항 답변 체크
    const canSubmit = answers.every(answer => answer !== null);

    // 제출 이벤트
    const handleSubmit = async () => {
        if (!checkLogin()) return; // 비로그인 제출 차단

        if(answers.some(a => a === null)) {
            alert('모든 질문에 답변해 주세요.');
            return;
        }

        if (!canSubmit) return;

        // 결과 점수 계산
        const totalScore = calculateTotalScore();
        setLoading(true);

        try {
            await submitDiagnosis({totalScore, type: test.type });

            // 서버에 제출한 후 최신 상태 재조회 (현재 년|월 넘겨주기)

                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;

                const lastestStatus = await fetchSelfDiagnosisStatus(year, month);

                setResultData(lastestStatus[test.type]);  // 해당 테스트 유형과 결과만 저장

                // onClose(); // 모달 닫기 + 후처리 필요

        } catch {
            alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    if (resultData) {
        return (
            <div className="modal-background">
                <div className="modal-box">
                    <button
                        className="close-btn"
                        onClick={() => {
                            setResultData(null);  // 결과 초기화
                            onClose();            // 모달 닫기
                        }}
                    >
                        x
                    </button>
                    <h2>{test.label} 결과</h2>
                    <div>
                        <p>진단 결과: {resultData.result ?? "-"}</p>
                        <p>{test.type}: {resultData.percentage ?? "-"}%</p>
                        <p>다음 진단 가능일: {resultData.nextAvailableDate ?? "-"}</p>
                    </div>
                    <button
                        onClick={() => {
                            setResultData(null);
                            onClose();
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>
        );
    }

    // 점수 계산 함수 (역채점 포함)
    const calculateTotalScore = () => {
        let totalScore = 0;

        answers.forEach((answer, idx) => {
            if (answer === null) return; // 미응답 처리 (안전)

            // 불안, 우울 테스트의 마지막 문항은 점수에 포함하지 않음
            if ((test.type === "anxiety" || test.type === "depression") && idx === test.questions.length - 1) {
                return; // 점수 계산 제외
            }

            // 역체점 문항 체크
            if (test.reverseScoreIdx &&
                test.reverseScoreIdx.includes(idx)) {
                // 최대 점수는 currentOptions.length -1
                totalScore += (currentOptions.length - 1) - answer;
            } else {
                totalScore += answer;
            }
        });

        return totalScore;
    }

    return (
        <div className="modal-background">
            <div className="modal-box">
                <button className="close-btn"
                        onClick={() => {
                            setResultData(null);
                            onClose();}}>
                    x
                </button>
                <h2>{test.label}</h2>

                <div className="question-box">
                    <p> {step+1}. {test.questions[step]} </p>

                    <div className="options">
                        {currentOptions.map((opt, idxOpt) => (
                            <label key={idxOpt} className="option-label">
                                <input
                                    type="radio" name={`q${step}`}
                                    checked={answers[step] === idxOpt}
                                    onChange={() => handleSelect(step, idxOpt)}
                                />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                    {alertMsg && (
                        <div className="alert-message">
                            답변이 완료되지 않았습니다.
                        </div>
                    )}
                </div>

                <div className="modal-nav">
                    <button onClick={handlePrev} disabled={step === 0}> 이전 </button>
                    <button onClick={handleNext} disabled={step === test.questions.length-1}> 다음 </button>
                </div>


                {step === test.questions.length - 1 &&
                    <button className="submit-btn"
                            disabled={!canSubmit || loading} onClick={handleSubmit}> { loading ? '분석 중...' : "제출하기" } </button>
                }
            </div>
        </div>
    );
}

export default TestModal;