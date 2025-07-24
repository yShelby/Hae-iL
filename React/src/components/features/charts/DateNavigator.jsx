import { addDays, addMonths, format, startOfDay, isBefore, isEqual } from "date-fns";
import {Button} from "@shared/UI/Button.jsx";
import {useCallback, useEffect, useState} from "react";

export default function DateNavigator({
                                          isWeekly,
                                          onChangeWeekly,
                                          onChangeMonthly,
                                          onChangeWeeklyForFetch,
                                          onChangeMonthlyForFetch,
                                          onChangeTwoMonthsForFetch
}){
    const [currentEndDate, setCurrentEndDate] = useState(new Date());

    // ===============================================

    // === 날짜 라벨 관련 생성 로직 ===

    // 주간 버튼이 활성화 되어 있을 때 :
        // 주간 감정 점수 & 수면 시간 & 운동 시간(End date를 기준으로 지난 7일) +
        // 자가 진단 점수 (End date를 기준으로 이번달, 지난달)
    // 월간 버튼이 활성화 되어 있을 때 :
        // 월간 감정 점수 (End date를 기준으로 지난 30일) +
        // 수면 시간 & 운동 시간 (End date를 기준으로 지난 7일) +
        // 자가 진단 점수 (End date를 기준으로 이번달, 지난달)

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

    // 분기에 따른 label, fetch 도출
    const handleChangeLabelFetch = useCallback((endDate) => {
        const chartDateLabels = generateDateList(isWeekly, endDate); // 날짜 생성
        const lastMonth = addMonths(endDate, -1); // diagnosis fetch 용 이전 달
        const currentMonth = addMonths(endDate, 0); // diagnosis fetch 용 현재 달

        const fetchEndDate = addDays(endDate, 0);
        const fetchWeeklyStartDate = addDays(endDate, -6); // 오늘 날짜를 포함한 지난 일주일 조회

        if (isWeekly === 'weekly'){ // 주간 그래프만 호출할 때
            onChangeWeekly(chartDateLabels); // 주간 라벨
            onChangeMonthly([]); // 월간 라벨 없음
            onChangeWeeklyForFetch([format(fetchWeeklyStartDate, "yyyy-MM-dd"), format(fetchEndDate, "yyyy-MM-dd")]); // 주간 DB 조회 리스트(날짜)
            onChangeMonthlyForFetch([]); //월간 DB 조회 없음
        }else{ // 월간 그래프, 주간 그래프 모두 호출할 때

            // === DB 조회용 Monthly list [StartDate, EndDate] ===
            const fetchMonthlyStartDate = addDays(endDate, -29);// 오늘 날짜를 포함한 지난 한달 조회

            onChangeWeekly(chartDateLabels.slice(-7)); // 주간 라벨
            onChangeMonthly(chartDateLabels); // 월간 라벨 전송
            onChangeWeeklyForFetch([format(fetchWeeklyStartDate, "yyyy-MM-dd"), format(fetchEndDate, "yyyy-MM-dd")]); // 주간 DB 조회 리스트(날짜)
            onChangeMonthlyForFetch([format(fetchMonthlyStartDate, "yyyy-MM-dd"), format(fetchEndDate, "yyyy-MM-dd")]); // 월간 DB 조회 리스트(날짜)
        }

        onChangeTwoMonthsForFetch([format(lastMonth, "yyyy-MM"), format(currentMonth, "yyyy-MM")]); // diagnosis Fetch 전송용 리스트(달)

    }, [isWeekly, onChangeWeekly, onChangeMonthly, onChangeWeeklyForFetch, onChangeMonthlyForFetch, onChangeTwoMonthsForFetch]);

    useEffect(()=>{ // currentEndDate 업데이트 때마다 날짜 label 및 fetch 외부 전송
        handleChangeLabelFetch(currentEndDate);
    }, [currentEndDate, handleChangeLabelFetch, isWeekly])

    // 이전
    const onPrev = () => {
        const prevEndDate = isWeekly === 'weekly' ? addDays(currentEndDate, -7)
            : addMonths(currentEndDate, -1);

        setCurrentEndDate(prevEndDate); // DateNavigator 내부 date 인식
    }

    // 다음
    const onNext = () => {
        const nextEndDate = isWeekly === 'weekly' ? addDays(currentEndDate, 7)
            : addMonths(currentEndDate, 1);

        setCurrentEndDate(nextEndDate); // DateNavigator 내부 date 인식
    }

    // 오늘 이후로 이동 금지
    const canGoForward = () => {
        const nextStart = startOfDay(new Date(currentEndDate));
        const today = startOfDay(new Date());
        return isBefore(nextStart, today) || isEqual(nextStart, today)
    };


    return (
        <div>
            <Button onClick={onPrev}>&lt;</Button>
            <Button onClick={onNext} disabled={!canGoForward()}>&gt;</Button>
        </div>
    );
}
