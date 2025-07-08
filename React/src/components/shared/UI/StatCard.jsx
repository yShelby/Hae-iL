import CountUp from "react-countup";
import "./css/StatCard.css";

const StatCard = ({icon, label, value, color, loading, onClick}) => {
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
                    {loading ? '...' : <CountUp end={value} duration={1.0} separator="," />}
                </div>
            </div>
        </div>
    );
};

export default StatCard;