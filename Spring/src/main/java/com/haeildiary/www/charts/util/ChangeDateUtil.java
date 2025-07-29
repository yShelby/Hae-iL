package com.haeildiary.www.charts.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

// 삽입된 endDate를 기준으로 날짜 변환하는 Util
public class ChangeDateUtil {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // String EndDate를 LocalDate로 변환
    public static LocalDate parseEndDate(String endDate){
        return LocalDate.parse(endDate, DATE_FORMATTER);
    }

    // EndDate에서 StartDate 추출
    public static LocalDate calculateStartDate(String mode, LocalDate endDate) {
        if ("weekly".equals(mode)) { // mode가 weekly일 경우
            return endDate.minusDays(6); // 오늘 포함 지난 7일
        } else if ("monthly".equals(mode)) { // mode가 monthly일 경우
            return endDate.minusDays(29); // 오늘 포함 지난 30일
        } else {
            throw new IllegalArgumentException("지원하지 않는 mode입니다: " + mode);
        }
    }

    // 날짜 순환 로직 작성
    public static <T, R> List<R> fillDateRangeWithValue(
            LocalDate startDate,
            LocalDate endDate,
            Map<LocalDate, T> dataMap,
            BiFunction<LocalDate, T, R> mapper) {

        List<R> result = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            T value = dataMap.get(date);
            result.add(mapper.apply(date, value)); // value가 null이면 null이나 기본 객체로 처리 가능
        }
        return result;
    }

    // EndDate에서 lastMonth (year, Month) 추출
    // 지난달 연-월 계산
    public static int getLastMonthYear(LocalDate endDate) {
        LocalDate lastMonth = endDate.minusMonths(1);
        return lastMonth.getYear();
    }

    public static int getLastMonth(LocalDate endDate) {
        LocalDate lastMonth = endDate.minusMonths(1);
        return lastMonth.getMonthValue();
    }

    // 이번달 연-월 계산
    public static int getThisMonthYear(LocalDate endDate) {
        return endDate.getYear();
    }

    public static int getThisMonth(LocalDate endDate) {
        return endDate.getMonthValue();
    }

}
