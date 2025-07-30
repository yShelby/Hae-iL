import {useEffect, useState} from "react";
import {getDashboardStats} from "@api/countApi.js";
import "./css/MyRecordStatus.css";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {format} from "date-fns";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {IconNotebook, IconWritingSign, IconPhoto} from "@tabler/icons-react";

const MyRecordStatus = () => {
    const [stats, setStats] = useState({
        totalDiaryCount: 0,
        journalingCount: 0,
        galleryImageCount: 0,
    });

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const {user, loading: authLoading} = useAuth();
    const checkLogin = useCheckLogin();

    const today = format(new Date(), "yyyy-MM-dd");

    const handleProtectedNavigation = (path) => {
        if (!checkLogin()) return;
        navigate(path);
    }

    useEffect(() => {
        const fetchStats = async () => {
            if (!user || authLoading) return; // 인증 안됐으면 요청 x
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, [user, authLoading]);

    // [수정] 명세서 디자인과 Tabler 아이콘을 적용한 새로운 JSX 구조
    return (
        <section className="record-status-widget-container">
            <div className="record-status-card-grid">
                {/* 하루물결 카드 */}
                <div className="record-status-card" onClick={() => handleProtectedNavigation(`/diary/date/${today}`)}>
                    <div className="card-content">
                        {/* [수정] 라이브러리 아이콘 적용 및 명세서 속성 전달 */}
                        <IconNotebook size={42} color="#393E75" stroke={1.5} />
                        <span className="card-label">하루물결</span>
                    </div>
                    <span className="card-value">{loading ? '...' : stats.totalDiaryCount}</span>
                </div>

                {/* 윤슬조각 카드 */}
                <div className="record-status-card" onClick={() => handleProtectedNavigation('/journal')}>
                    <div className="card-content">
                        {/* [수정] 라이브러리 아이콘 적용 및 명세서 속성 전달 */}
                        <IconWritingSign size={42} color="#393E75" stroke={1.5} />
                        <span className="card-label">윤슬조각</span>
                    </div>
                    <span className="card-value">{loading ? '...' : stats.journalingCount}</span>
                </div>

                {/* 그림기억 카드 */}
                <div className="record-status-card" onClick={() => handleProtectedNavigation('/gallery')}>
                    <div className="card-content">
                        {/* [수정] 라이브러리 아이콘 적용 및 명세서 속성 전달 */}
                        <IconPhoto size={42} color="#393E75" stroke={1.5} />
                        <span className="card-label">그림기억</span>
                    </div>
                    <span className="card-value">{loading ? '...' : stats.galleryImageCount}</span>
                </div>
            </div>
        </section>
    );
};

export default MyRecordStatus;