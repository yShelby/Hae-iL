import { addDays, addMonths, format, startOfDay, isBefore, isEqual } from "date-fns";
import {Button} from "@shared/UI/Button.jsx";
import {useCallback, useEffect} from "react";

export default function DateNavigator({
                                          endDate,
                                          setEndDate,
                                          mode,
                                          onChangeWeekly,
                                          onChangeMonthly
                                      }) {

    // ===============================================
    // === 날짜 라벨 관련 생성 로직 ===
    // ===============================================

    // 차트용 날짜 리스트 생성 함수
    const generateDateList = useCallback((isWeekly, endDate) => {
        const chartLabels = [];

        for (let i = isWeekly === 'weekly' ? 7 : 30 ; i > 0; i--) {
            const date = addDays(endDate, -i + 1); // endDate 포함
            chartLabels.push(format(date, "M/d"));
        }

        return chartLabels;
    }, []);

    // 분기에 따른 label 도출
    const handleChangeLabelFetch = useCallback((endDate) => {
        const chartDateLabels = generateDateList(mode, endDate); // 날짜 생성

        if (mode === 'weekly'){ // 주간 그래프만 호출할 때
            onChangeWeekly(chartDateLabels); // 주간 라벨
            onChangeMonthly([]); // 월간 라벨 없음
        } else { // 월간 그래프, 주간 그래프 모두 호출할 때
            onChangeWeekly(chartDateLabels.slice(-7)); // 주간 라벨
            onChangeMonthly(chartDateLabels); // 월간 라벨 전송
        }

    }, [mode, onChangeWeekly, onChangeMonthly, generateDateList]);

    useEffect(() => { // endDate 업데이트 때마다 날짜 label 외부 전송
        handleChangeLabelFetch(endDate);
    }, [endDate, handleChangeLabelFetch, mode]);

    // 이전
    const onPrev = () => {
        const prevEndDate = mode === 'weekly' ? addDays(endDate, -7)
            : addMonths(endDate, -1);

        setEndDate(prevEndDate); // Charts 컴포넌트의 endDate 업데이트
    };

    // 다음
    const onNext = () => {
        const nextEndDate = mode === 'weekly' ? addDays(endDate, 7)
            : addMonths(endDate, 1);

        setEndDate(nextEndDate); // Charts 컴포넌트의 endDate 업데이트
    };

    // 오늘 이후로 이동 금지
    const canGoForward = () => {
        const nextStart = startOfDay(new Date(endDate));
        const today = startOfDay(new Date());
        return isBefore(nextStart, today) || isEqual(nextStart, today);
    };

    return (
        <div>
            <Button onClick={onPrev}>&lt;</Button>
            <Button onClick={onNext} disabled={!canGoForward()}>&gt;</Button>
        </div>
    );
}