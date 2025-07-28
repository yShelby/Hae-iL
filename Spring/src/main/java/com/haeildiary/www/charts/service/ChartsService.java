// ChartsService.java
package com.haeildiary.www.charts.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ChartsService {

    // TODO: Repository 의존성 추가
    // @Autowired
    // private MoodRepository moodRepository;
    // @Autowired
    // private ExerciseRepository exerciseRepository;
    // @Autowired
    // private SleepRepository sleepRepository;
    // @Autowired
    // private PsychologicalTestRepository psychologicalTestRepository;

    /**
     * 전체 차트 데이터 조회 - 모든 데이터를 한 번에 반환
     */
    public Map<String, Object> getAllChartData() {
        log.info("전체 차트 데이터 조회 시작");

        return Map.of(
                "moodScores", getMoodScores(),
                "exerciseDuration", getExerciseDuration(),
                "sleepTime", getSleepTime(),
                "lastMonthResults", getLastMonthResults(),
                "thisMonthResults", getThisMonthResults()
        );
    }

    /**
     * 기분 점수 데이터 조회
     */
    private List<Map<String, Object>> getMoodScores() {
        log.info("기분 점수 데이터 조회");

        // TODO: Repository에서 데이터 조회
        // return moodRepository.findMoodScores();

        // 임시 더미 데이터 반환
        return List.of(
                Map.of("assessmentDate", "2025-07-21", "score", -50),
                Map.of("assessmentDate", "2025-07-22", "score", 20),
                Map.of("assessmentDate", "2025-07-23", "score", 80),
                Map.of("assessmentDate", "2025-07-24", "score", -30),
                Map.of("assessmentDate", "2025-07-25", "score", 60),
                Map.of("assessmentDate", "2025-07-26", "score", 10),
                Map.of("assessmentDate", "2025-07-27", "score", 40)
        );
    }

    /**
     * 운동 시간 데이터 조회
     */
    private List<Map<String, Object>> getExerciseDuration() {
        log.info("운동 시간 데이터 조회");

        // TODO: Repository에서 데이터 조회
        // return exerciseRepository.findExerciseDuration();

        // 임시 더미 데이터 반환
        return List.of(
                Map.of("exerciseDate", "2025-07-21", "duration", 30),
                Map.of("exerciseDate", "2025-07-22", "duration", 45),
                Map.of("exerciseDate", "2025-07-23", "duration", 0),
                Map.of("exerciseDate", "2025-07-24", "duration", 60),
                Map.of("exerciseDate", "2025-07-25", "duration", 20),
                Map.of("exerciseDate", "2025-07-26", "duration", 90),
                Map.of("exerciseDate", "2025-07-27", "duration", 15)
        );
    }

    /**
     * 수면 시간 데이터 조회
     */
    private List<Map<String, Object>> getSleepTime() {
        log.info("수면 시간 데이터 조회");

        // TODO: Repository에서 데이터 조회
        // return sleepRepository.findSleepTime();

        // 임시 더미 데이터 반환
        return List.of(
                Map.of("sleepDate", "2025-07-21", "bedtime", 1500, "waketime", 1950),
                Map.of("sleepDate", "2025-07-22", "bedtime", 1290, "waketime", 1910),
                Map.of("sleepDate", "2025-07-23", "bedtime", 1515, "waketime", 1980),
                Map.of("sleepDate", "2025-07-24", "bedtime", 1380, "waketime", 1920),
                Map.of("sleepDate", "2025-07-25", "bedtime", 1545, "waketime", 1995),
                Map.of("sleepDate", "2025-07-26", "bedtime", 1070, "waketime", 1410),
                Map.of("sleepDate", "2025-07-27", "bedtime", 1520, "waketime", 1930)
        );
    }

    /**
     * 지난달 심리 검사 결과 조회
     */
    private Map<String, Object> getLastMonthResults() {
        log.info("지난달 심리 검사 결과 조회");

        // TODO: Repository에서 데이터 조회
        // return psychologicalTestRepository.findLastMonthResults();

        // 임시 더미 데이터 반환
        return Map.of(
                "yearMonth", "2025-06",
                "anxiety", 15,
                "depression", 12,
                "stress", 18
        );
    }

    /**
     * 이번달 심리 검사 결과 조회
     */
    private Map<String, Object> getThisMonthResults() {
        log.info("이번달 심리 검사 결과 조회");

        // TODO: Repository에서 데이터 조회
        // return psychologicalTestRepository.findThisMonthResults();

        // 임시 더미 데이터 반환
        return Map.of(
                "yearMonth", "2025-07",
                "anxiety", 9,
                "depression", 7,
                "stress", 26
        );
    }
}