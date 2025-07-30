package com.haeildiary.www.selfdiagnosis.util;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@Slf4j
public class CalculateUtil {

    // 퍼센트 계산
    public static Integer calculatePercentage(Integer totalScore, Integer maxScore){
        if (totalScore == null || totalScore == 0){
            return 0;
        }

        Integer percentageResult = (Integer) (int) Math.round(((double) totalScore / maxScore) * 100);

        log.info("percentage result : {}", percentageResult);

        // 총점을 퍼센트로 변환 후 반환
        return percentageResult;

    }

    // 다음 검사일 계산
    public static LocalDate calculateNextAvailableDate() {
        // 현재 날짜에서 한 달 후
        return LocalDate.now().plusMonths(1);
    }
}
