import {useEffect, useState} from "react";
import {getDashboardStats} from "@api/countApi.js";
import StatCard from "@shared/UI/StatCard.jsx";
import {FaBookMedical, FaImages, FaPenAlt} from "react-icons/fa";
import "./css/MyRecordStatus.css";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {format} from "date-fns";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";

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

    return (
        <section className="record-status-widget-container">
            <div className="record-status-card-grid">
                <StatCard
                    icon={<FaBookMedical />}
                    label={<>일기<br/>기록수</>}
                    value={stats.totalDiaryCount}
                    color="#e3f2fd"
                    loading={loading}
                    onClick={() => handleProtectedNavigation(`/diary/date/${today}`)}
                />
                <StatCard
                    icon={<FaPenAlt />}
                    label={<>저널링<br/>기록수</>}
                    value={stats.journalingCount}
                    color="#e8f5e9"
                    loading={loading}
                    onClick={() => handleProtectedNavigation('/journal')}
                />
                <StatCard
                    icon={<FaImages />}
                    label={<>갤러리<br/>사진수</>}
                    value={stats.galleryImageCount}
                    color="#f3e5f5"
                    loading={loading}
                    onClick={() => handleProtectedNavigation('/gallery')}
                />
            </div>
        </section>
    );
};

export default MyRecordStatus;