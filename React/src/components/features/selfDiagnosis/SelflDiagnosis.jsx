import { useState } from "react";
import TestModal from "./TestModal";
import { testList } from "./testData.js"
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useSelfDiagnosisStatus} from "@/hooks/useSelfDiagnosisStatus.js";
import {useAuth} from "@shared/context/AuthContext.jsx";
import "../../pages/css/MonthlyPage.css"
import Button from "@shared/styles/Button.jsx";
import { IconMoodCheck } from '@tabler/icons-react';




function SelfDiagnosis() {
    const { user, loading } = useAuth();
    const checkLogin = useCheckLogin();
    const [openType, setOpenType] = useState(null); // 'depression', 'anxiety', 'stress'

    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    // 로그인 여부 체크
    // 로그인 상태 기반으로 쿼리 실행
    // refetch 수동으로 쿼리를 다시 요청하는 함수
    const { data: statusData, isLoading, isError, refetch } = useSelfDiagnosisStatus(year, month, !!user);

    console.log(statusData);

    const handleOpen = (type) => {
        // 비로그인 사용자 접근 차단
        if (!checkLogin()) return;
        setOpenType(type)
    };
    const handleClose = () => {
        setOpenType(null);
        refetch(); // 모달 닫힐 떄 최신 상태 재요청
    }

    if (isLoading) return <div>로딩 중...</div>;
    if (isError) return <div>데이터 로드 실패</div>;


    return (
        <div className="diagnosis-container">
            <h3>자가 진단 실시하기 </h3>
            {testList.map(({ type, label }) => {

                const status = statusData?.[type];
                const disabled = status ? !status.available : false;

                return (
                    <div key={type}>
                            {disabled ? (
                                    <div className="test-box result">
                                        <div className="test-label">
                                            <span style={{fontWeight: "bold", fontSize: "14px"}}> 지난 {label} 진단 결과</span>
                                        </div>
                                        <div className="last-result">
                                            <span>
                                                {status.result ?? '-'}
                                                {status.percentage !== undefined && ` (${status.percentage} %)`}
                                            </span>
                                                {status.nextAvailableDate ? <span><strong> {status.nextAvailableDate} </strong> 이후 검사 가능</span> : ''}
                                        </div>
                                    </div>
                            ) : (
                                <div className="test-box">
                                    <div className="test-label">
                                        <span className="test-label">{label} 진단 하기</span>
                                        <span>{(label === "스트레스") ? "10문항 | 4분" : "8문항 | 3분"}</span>
                                    </div>
                                    <Button
                                        id="test-btn"
                                        variant="button4"
                                        icon={IconMoodCheck}
                                        onClick={() => handleOpen(type)}
                                        disabled={disabled}
                                        style={{
                                            cursor : disabled ? "not-allowed" : "pointer",
                                            opacity: disabled ? 0.5 : 1,
                                        }}
                                    />
                                </div>
                            )}

                    </div>
                );
            })}

            {openType && (
                <TestModal
                    test={testList.find(t => t.type === openType)}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}

export default SelfDiagnosis;