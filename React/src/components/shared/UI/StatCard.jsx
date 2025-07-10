import CountUp from "react-countup";
import "./css/StatCard.css";

const StatCard = ({icon, label, value, color, loading, onClick}) => {
    // ✅ 에러 방지를 위한 안전한 숫자 처리:
    // - value가 undefined, null, 문자열 등일 경우 NaN이 될 수 있기 때문에
    // - typeof 또는 Number.isFinite로 검사하여 안전한 숫자만 CountUp에 전달
    const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;

    return (
        <div
            className={`stat-card-container ${onClick ? "clickable" : ""}`}
            style={{ backgroundColor: color || '#f5f5f5' }}
            onClick={onClick}
        >
            <div className="stat-card-icon-wrapper">{icon}</div>
            <div className="stat-card-content-wrapper">
                <div className="stat-card-label">{label}</div>
                <div className="stat-card-value">
                    {loading ? '...' : (
                        // ✅ CountUp은 내부적으로 toFixed()를 사용하기 때문에
                        //    반드시 숫자만 넘겨야 함. 위에서 safeValue로 처리 완료!
                        <CountUp end={safeValue} duration={1.0} separator="," />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;