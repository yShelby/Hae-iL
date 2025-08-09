import {useState, useCallback, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';
import { fetchDiaryByDateAPI } from '@api/diaryApi.js';
import { formatDateToString } from '@shared/utils/dateUtils.js';

export const useDiaryData = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { date: urlDate } = useParams()

    const initialDate = urlDate || formatDateToString(new Date());
    const [selectedDate, setSelectedDate] = useState(initialDate);

    // const [selectedDate, setSelectedDate] = useState(formatDateToString(new Date()));
    const [diaryForDate, setDiaryForDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ 날짜 클릭 시 상세 페이지 이동
    const handleDateClick = useCallback((dateObj) => {
        if (!user) {
            showToast.error('로그인이 필요합니다.');
            return;
        }

        const dateStr = formatDateToString(dateObj);
        console.log('[handleDateClick] 날짜 클릭됨:', dateStr);
        setSelectedDate(dateStr);
        navigate(`/diary/date/${dateStr}`);
    }, [navigate, user]);

    // 📥 특정 날짜 일기 fetch
    const fetchDiaryForDate = useCallback(async (dateStr) => {
        console.log('[fetchDiaryForDate] 일기 가져오기 시도:', dateStr);
        setIsLoading(true);
        try {
            const res = await fetchDiaryByDateAPI(dateStr);
            console.log('[fetchDiaryForDate] 일기 데이터:', res.data);
            setDiaryForDate(res.data);
        } catch (e) {
            console.warn('[fetchDiaryForDate] 일기 없음 또는 오류:', e);
            console.log('[fetchDiaryForDate] 일기 없음 또는 오류:', e);
            setDiaryForDate(null); // 없으면 null
        } finally {
            setIsLoading(false);
        }
    }, []);

    // selectedDate가 바뀔 때마다 자동으로 해당 일기 데이터 불러오기
    useEffect(() => {
        console.log('[useEffect] selectedDate 변경됨:', selectedDate);
        if (selectedDate) {
            setDiaryForDate(null);
            fetchDiaryForDate(selectedDate);
        }
    }, [selectedDate, fetchDiaryForDate]);

    // 일기 저장/삭제 후 상태 갱신용 함수 (예: 감정 분석 수정 후 호출)
    const handleDiaryUpdated = useCallback(() => {
        console.log('[handleDiaryUpdated] 감정 분석 등으로 일기 갱신 요청됨');
        if (!selectedDate) return;
        fetchDiaryForDate(selectedDate);
    }, [selectedDate, fetchDiaryForDate]);

    const selectedDiaryId = diaryForDate?.diaryId || null;

    useEffect(() => {
        console.log('[STATE] selectedDate:', selectedDate);
        console.log('[STATE] diaryForDate:', diaryForDate);
        console.log('[STATE] selectedDiaryId:', selectedDiaryId);
        console.log('[STATE] isLoading:', isLoading);
    }, [selectedDate, diaryForDate, selectedDiaryId, isLoading]);

    return {
        user,
        selectedDate,
        selectedDiaryId,
        setSelectedDate,
        diaryForDate,
        isLoading,
        handleDateClick,
        fetchDiaryForDate,
        handleDiaryUpdated
    };
};
