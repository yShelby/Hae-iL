import {useState} from "react";
import "./TestModal.css";


function TestModal({ test, onClose }) {

    const [step, setStep] = useState(0);
    const [answers, setAnswers] =useState(Array(test.questions.length).fill(null));

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
        if (idx < test.questions.length -1) setStep(idx +1);
    };

    // 제출 여부 : 모든 문항 답변 체크
    const canSubmit = answers.every(answer => answer !== null);
    // 제출 이벤트
    const handleSubmit = () => {
        if (!canSubmit) return;

        // 결과 점수 계산
        const totalScore = calculateTotalScore();

        //API 호출 or 결과 값 전달 필요
        // console.log("[제출] 총 점수 : ", totalScore);
        // alert(`총 점수 : ${totalScore} + 로직 구현 필요.`);

        // 모달 달기 + 후처리
        onClose();
    }

    // 점수 계산 함수 (역채점 포함)
    const calculateTotalScore = () => {
        let totalScore = 0;

        answers.forEach((answer, idx) => {
            if (answer === null) return; // 미응답 처리 (안전)

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
                <button className="close-btn" onClick={onClose}> x </button>
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
                </div>

                <div className="modal-nav">
                    <button onClick={() => setStep(s => Math.max(s-1, 0))} disabled={step === 0}> 이전 </button>
                    <button onClick={() => setStep(s => Math.min(s+1, test.questions.length-1))} disabled={step === test.questions.length-1}> 다음 </button>
                </div>

                {step === test.questions.length - 1 &&
                    <button className="submit-btn"
                            disabled={!canSubmit} onClick={handleSubmit}> 제출하기 </button>
                }
            </div>
        </div>
    );
}

export default TestModal;