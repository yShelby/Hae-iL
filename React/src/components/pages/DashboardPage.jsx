import MyRecordStatus from "@features/dashboard/MyRecordStatus.jsx";
import "./css/DashboardPage.css";

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            {/* --- ⬇️ 좌측 컬럼 ⬇️ --- */}
            <div className="dashboard-left-column">
                <MyRecordStatus />
                <div className="placeholder-box" style={{ height: '250px' }}>
                    오늘 감정 분석 / 최근 자가 진단 결과 (영역)
                </div>
                <div className="placeholder-box" style={{ height: '150px' }}>
                    중요한 일 / to do (영역)
                </div>
            </div>

            {/* --- ⬇️ 우측 컬럼 ⬇️ --- */}
            <div className="dashboard-right-column">
                <div className="placeholder-box" style={{ height: '80px' }}>날씨 (영역)</div>
                <div className="placeholder-box" style={{ height: '80px' }}>포춘쿠키 (영역)</div>
                <div className="placeholder-box" style={{ height: '120px' }}>오늘의 질문 (영역)</div>
                <div className="placeholder-box" style={{ flexGrow: 1 }}>달력 (영역)</div>
            </div>
        </div>
    );
};

export default DashboardPage;