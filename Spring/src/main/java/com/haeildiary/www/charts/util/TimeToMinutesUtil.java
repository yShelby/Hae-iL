package com.haeildiary.www.charts.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TimeToMinutesUtil {

    // =======================================================
    // === 시간 계산 로직 ===
    // =======================================================
    // ### 기본 로직
    // 1. 취침 시간은 일반적으로 전날과 다음날(=일기 작성 당일)에 걸쳐있음(주로 이틀, 최대 사흘까지)
    // 2. 취침시각과 일어난 시각이 전날에서 다음날에 걸쳐져 있는지, 다음날 당일에만 있는지 확인하기 위한 로직
    // 2-1. 취침시각 - 일어난 시각 > 0 : 취침시각은 전날, 일어난 시각은 다음날
    // 2-2. 취침시각 - 일어난 시각 =< 0 : 취침시각은 다음날, 일어난 시각도 다음날
    // 3. 취침시각이 오전(AM)인지 오후(PM)인지 판별하기 위해 SLEEP_DAY/2 사용
    // 3-1. 취침시각 - SLEEP_DAY/2 >= 0 : 취침시각은 오후
    // 3-2. 취침시각 - SLEEP_DAY/2 < 0 : 취침시각은 오전

    // ### [bedtime, waketime] 로직
    // 1. 취침시각 - SLEEP_DAY/2 >= 0 이며 취침시각 - 일어난 시각 > 0인 경우 (취침시각 전날 오후, 일어난 시각 다음날 오전)
    // = [bedtime, waketime + SLEEP_DAY]
    // 2. 취침시각 - SLEEP_DAY/2 >= 0 이며 취침시각 - 일어난 시각 =< 0인 경우 (취침시각 전날 오후, 일어난 시각 전날 오후)
    // = [bedtime, waketime]
    // 3. 취침시각 - SLEEP_DAY/2 < 0이며, 취침시각 - 일어난 시각 > 0인 경우 (취침시각 다음날 오전, 일어난 시각 다다음날 오전)
    // = [bedtime + SLEEP_DAY, waketime  + SLEEP_DAY * 2]
    // 4. 취침시각 - SLEEP_DAY/2 < 0, 취침시각 - 일어난 시각 =< 0인 경우 (취침시각 다음날 오전, 일어난 시각 다음날 오전 또는 오후)
    // = [bedtime + SLEEP_DAY, waketime  + SLEEP_DAY]
    // =======================================================

    // 하루를 분으로 환산(= 24시간 = 1440분)
    private static final int SLEEP_DAY = 1440;

    // 오전/오후 구분
    private static final int HALF_DAY = SLEEP_DAY / 2;

    // 타입 매개 변수
    public record NormalizedSleepTime(Integer normalizedBedtime, Integer normalizedWaketime) {
        public int getSleepDurationMinutes() {
            return normalizedWaketime - normalizedBedtime;
        }
    }

    // 수면 시간 데이터 정규화 로직
    public static NormalizedSleepTime normalizeSleepTime(Integer bedtimeMinutes, Integer waketimeMinutes) {
        log.debug("수면시간 정규화 시작 - 취침: {}분, 기상: {}분", bedtimeMinutes, waketimeMinutes);

        // 데이터가 null일 때 null 반환
        if (bedtimeMinutes == null || waketimeMinutes == null) {
            log.debug("취침시각 또는 기상시각이 null입니다.");
            return new NormalizedSleepTime(bedtimeMinutes, null);  // 0으로 통일
        }

        int normalizedBedtime = bedtimeMinutes;
        int normalizedWaketime = waketimeMinutes;

        if (bedtimeMinutes >= HALF_DAY && waketimeMinutes < bedtimeMinutes) {
            normalizedWaketime = waketimeMinutes + SLEEP_DAY;
            log.debug("케이스 1 적용 - 취침 전날 오후, 기상 다음날 오전");
        } else if (bedtimeMinutes < HALF_DAY && waketimeMinutes < bedtimeMinutes) {
            normalizedBedtime = bedtimeMinutes + SLEEP_DAY;
            normalizedWaketime = waketimeMinutes + (SLEEP_DAY * 2);
            log.debug("케이스 2 적용 - 취침 다음날 오전, 기상 다다음날 오전");
        } else if (bedtimeMinutes < HALF_DAY && waketimeMinutes >= bedtimeMinutes) {
            normalizedBedtime = bedtimeMinutes + SLEEP_DAY;
            normalizedWaketime = waketimeMinutes + SLEEP_DAY;
            log.debug("케이스 3 적용 - 취침/기상 모두 다음날");
        } else {
            log.debug("케이스 4 적용 - 취침/기상 모두 전날 (변경 없음)");
        }

        NormalizedSleepTime result = new NormalizedSleepTime(normalizedBedtime, normalizedWaketime);
        log.debug("수면시간 정규화 완료 - 정규화된 취침: {}분, 정규화된 기상: {}분, 수면시간: {}분",
                normalizedBedtime, normalizedWaketime, result.getSleepDurationMinutes());

        return result;
    }
}