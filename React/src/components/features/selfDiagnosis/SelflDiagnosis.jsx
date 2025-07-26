import { useState } from "react";
import TestModal from "./TestModal";
import { testList } from "./testData.js"
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useSelfDiagnosisStatus} from "@/hooks/useSelfDiagnosisStatus.js";
import {useAuth} from "@shared/context/AuthContext.jsx";


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
    const { data: statusData, isLoading, isError } = useSelfDiagnosisStatus(year, month, !!user);

    const handleOpen = (type) => {
        // 비로그인 사용자 접근 차단
        if (!checkLogin()) return;
        setOpenType(type)
    };
    const handleClose = () => setOpenType(null);

    if (isLoading) return <div>로딩 중...</div>;
    if (isError) return <div>데이터 로드 실패</div>;


    return (
        <div style={{marginTop: "3rem",textAlign: "center"}}>
            {testList.map(({ type, label }) => {

                const status = statusData?.[type];
                const disabled = status ? !status.available : false;

                return (
                    <div key={type} style={{ marginBottom: "1rem" }}>
                        <button onClick={() => handleOpen(type)}
                            disabled={disabled}
                            style={{
                                cursor : disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.5 : 1,
                            }}
                        >
                            {label}
                        </button>
                        <span style={{ marginLeft: 12, fontSize: 14, color: disabled ? "#888" : "#333"}}>
                            {disabled ? (
                                <div>
                                    지난 결과 : {status.result} 점, {status.level} | <br />
                                    {status.next_available_date} 에 진단 가능합니다.
                                </div>
                            ) : (
                                `${type} 진단 실행 가능`
                            )}
                        </span>
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