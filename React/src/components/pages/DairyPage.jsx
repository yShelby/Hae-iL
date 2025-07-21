import { useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { formatDateToString } from '@shared/utils/dateUtils.js';

const DiaryPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date();
        const todayStr = formatDateToString(today);
        navigate(`/diary/date/${todayStr}`, { replace: true }); // URL 강제 이동
    }, [navigate]);

    return null; // 리다이렉트만 하므로 화면 없음
};

export default DiaryPage;
