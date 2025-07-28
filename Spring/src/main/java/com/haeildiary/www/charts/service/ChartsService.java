package com.haeildiary.www.charts.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.charts.dto.AllChartDataResponseDto;
import com.haeildiary.www.charts.dto.ChartRequestDto;
import com.haeildiary.www.charts.util.ChangeDateUtil;
import com.haeildiary.www.charts.util.TimeToMinutesUtil;
import com.haeildiary.www.health.repository.ExerciseLogRepository;
import com.haeildiary.www.health.repository.SleepLogRepository;
import com.haeildiary.www.mood.repository.MoodEntryRepository;
import com.haeildiary.www.selfdiagnosis.entity.AnxietySelfDiagnosis;
import com.haeildiary.www.selfdiagnosis.entity.DepressionSelfDiagnosis;
import com.haeildiary.www.selfdiagnosis.entity.StressSelfDiagnosis;
import com.haeildiary.www.selfdiagnosis.repository.AnxietyRepository;
import com.haeildiary.www.selfdiagnosis.repository.DepressionRepository;
import com.haeildiary.www.selfdiagnosis.repository.StressRepository;
import com.haeildiary.www.selfdiagnosis.util.StatusUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChartsService {

    private final UserRepository userRepository;
    private final MoodEntryRepository moodEntryRepository;
    private final SleepLogRepository sleepLogRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final AnxietyRepository anxietyRepository;
    private final DepressionRepository depressionRepository;
    private final StressRepository stressRepository;


    public AllChartDataResponseDto getAllChartData(Integer userId, ChartRequestDto chartRequestDto){
        log.info("전체 차트 데이터 조회 시작 - userId: {}, mode: {}, endDate: {}",
                userId, chartRequestDto.getMode(), chartRequestDto.getEndDate());

        // 사용자 검색
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        // =======================================================
        // 데이터 조회를 위한 날짜 계산
        // =======================================================
        // 1. 감정점수, 수면시간, 운동시간 데이터 조회를 위한 날짜 계산 (ChangeDateUtil 사용)
        LocalDate endDate = ChangeDateUtil.parseEndDate(chartRequestDto.getEndDate());
        LocalDate startDate = ChangeDateUtil.calculateStartDate(chartRequestDto.getMode(), endDate);

        // 2. 자가진단 데이터 조회를 위한 날짜 계산
            // 지난 달 연-월 계산
        Integer lastMonthYear = ChangeDateUtil.getLastMonthYear(endDate);
        Integer lastMonth = ChangeDateUtil.getLastMonth(endDate);

            // 이번 달 연-월 계산
        Integer thisMonthYear = ChangeDateUtil.getThisMonthYear(endDate);
        Integer thisMonth = ChangeDateUtil.getThisMonth(endDate);

        // =======================================================
        // 데이터 조회
        // =======================================================

        // 1) MoodScore
        List<AllChartDataResponseDto.MoodScore> moodScores = getMoodScores(userId, startDate, endDate);

        // 2) SleepTime
        List<AllChartDataResponseDto.SleepTime> sleepTime = getSleepTime(userId, startDate, endDate);

        // 3) ExerciseDuration
        List<AllChartDataResponseDto.ExerciseDuration> exerciseDuration = getExerciseDuration(userId, startDate, endDate);

        // 4) Last Month Anxiety, Depression, Stress
        AllChartDataResponseDto.MonthlyResult lastMonthResults = getLastMonthResults(userId, lastMonthYear, lastMonth);

        // 5) This Month Anxiety, Depression, Stress
        AllChartDataResponseDto.MonthlyResult thisMonthResults = getThisMonthResults(userId, thisMonthYear, thisMonth);

        // DTO 생성 및 반환
        AllChartDataResponseDto chartResponseData = new AllChartDataResponseDto(
                moodScores,
                sleepTime,
                exerciseDuration,
                lastMonthResults,
                thisMonthResults
        );

        log.info("전체 차트 데이터 출력 결과 : {}",
                chartResponseData);

        return chartResponseData;
    }


    // =======================================================
    // 데이터 조회 지역 변수
    // =======================================================

        // =======================================================
        // 1. 감정 점수 데이터 조회
        // 1) 감정 점수 조회
        private List<AllChartDataResponseDto.MoodScore> getMoodScores(Integer userId, LocalDate startDate, LocalDate endDate) {
            log.info("감정 점수 데이터 조회 - userId: {}, 기간: {} ~ {}", userId, startDate, endDate);

            List<Object[]> rawData = moodEntryRepository.findMoodScoresForChart(userId, startDate, endDate);
            Map<LocalDate, Integer> moodDataMap = new HashMap<>();
            for (Object[] row : rawData) {
                LocalDate date = (LocalDate) row[0];
                Integer score = (Integer) row[1];
                moodDataMap.put(date, score);
            }

            // Util 함수에서 날짜 리스트 순환
            List<AllChartDataResponseDto.MoodScore> moodScores = ChangeDateUtil.fillDateRangeWithValue(
                    startDate,
                    endDate,
                    moodDataMap,
                    AllChartDataResponseDto.MoodScore::new // date, score 매핑 생성자
            );

            log.info("감정 점수 데이터 조회 완료 - {} 건 (null 포함)", moodScores.size());

            return moodScores;
        }

        // =======================================================
        // 2. 수면 시간 데이터 조회
        private List<AllChartDataResponseDto.SleepTime> getSleepTime(Integer userId, LocalDate startDate, LocalDate endDate) {
            log.info("수면 시간 데이터 조회 - userId: {}, 기간: {} ~ {}", userId, startDate, endDate);

            List<Object[]> rawData = sleepLogRepository.findSleepDataForChart(userId, startDate, endDate);
            Map<LocalDate, AllChartDataResponseDto.SleepTime> sleepDataMap = new HashMap<>();

            for (Object[] row : rawData) {
                LocalDate sleepDate = (LocalDate) row[0];
                LocalTime bedtime = (LocalTime) row[1];
                LocalTime waketime = (LocalTime) row[2];

                Integer bedtimeMinutes = bedtime != null ? bedtime.getHour() * 60 + bedtime.getMinute() : null;
                Integer waketimeMinutes = waketime != null ? waketime.getHour() * 60 + waketime.getMinute() : null;

                TimeToMinutesUtil.NormalizedSleepTime normalizedSleepTime =
                        TimeToMinutesUtil.normalizeSleepTime(bedtimeMinutes, waketimeMinutes);

                sleepDataMap.put(sleepDate, new AllChartDataResponseDto.SleepTime(
                        sleepDate,
                        normalizedSleepTime.normalizedBedtime(),
                        normalizedSleepTime.normalizedWaketime()));
            }

            // Util 함수에서 날짜 리스트 순환
            List<AllChartDataResponseDto.SleepTime> sleepTimes = ChangeDateUtil.fillDateRangeWithValue(
                    startDate,
                    endDate,
                    sleepDataMap,
                    (date, sleepData) -> sleepData != null ? sleepData : new AllChartDataResponseDto.SleepTime(date, null, null)
            );

            log.info("수면 시간 데이터 조회 완료 - {} 건", sleepTimes.size());
            return sleepTimes;
        }


        // =======================================================
        // 3. 운동한 시간 데이터 조회
        private List<AllChartDataResponseDto.ExerciseDuration> getExerciseDuration(Integer userId, LocalDate startDate, LocalDate endDate) {
            log.info("운동 시간 데이터 조회 - userId: {}, 기간: {} ~ {}", userId, startDate, endDate);

            List<Object[]> rawData = exerciseLogRepository.findExerciseDurationForChart(userId, startDate, endDate);
            Map<LocalDate, Integer> exerciseDataMap = new HashMap<>();

            for (Object[] row : rawData) {
                LocalDate exerciseDate = (LocalDate) row[0];
                Long totalDuration = (Long) row[1];
                Integer duration = totalDuration != null ? totalDuration.intValue() : null;
                exerciseDataMap.put(exerciseDate, duration);
            }

            // Util 함수에서 날짜 리스트 순환
            List<AllChartDataResponseDto.ExerciseDuration> exerciseDurations = ChangeDateUtil.fillDateRangeWithValue(
                    startDate,
                    endDate,
                    exerciseDataMap,
                    (date, duration) -> new AllChartDataResponseDto.ExerciseDuration(date, duration != null ? duration : 0)
            );

            log.info("운동 시간 데이터 조회 완료 - {} 건", exerciseDurations.size());
            return exerciseDurations;
        }

        // =======================================================
        // 4. 지난 달 불안, 우울, 스트레스 자가진단 조회
        private AllChartDataResponseDto.MonthlyResult getLastMonthResults(Integer userId, Integer lastMonthYear, Integer lastMonth) {
            log.info("지난달 자가진단 결과 조회 - userId: {}, 년월: {}-{}", userId, lastMonthYear, lastMonth);

            // 각 자가진단 결과 조회
            Integer anxietyScore = getAnxietyScore(userId, lastMonthYear, lastMonth);
            Integer depressionScore = getDepressionScore(userId, lastMonthYear, lastMonth);
            Integer stressScore = getStressScore(userId, lastMonthYear, lastMonth);

            AllChartDataResponseDto.MonthlyResult result = new AllChartDataResponseDto.MonthlyResult(
                    lastMonthYear,
                    lastMonth,
                    anxietyScore,
                    depressionScore,
                    stressScore
            );
            log.info("지난달 자가진단 결과 조회 완료: {}", result);
            return result;
        }

        // =======================================================
        // 5. 이번 달 불안, 우울, 스트레스 자가진단 조회
        private AllChartDataResponseDto.MonthlyResult getThisMonthResults(Integer userId, Integer thisMonthYear, Integer thisMonth) {
            log.info("이번달 자가진단 결과 조회 - userId: {}, 년월: {}-{}", userId, thisMonthYear, thisMonth);

            // 각 자가진단 결과 조회
            Integer anxietyScore = getAnxietyScore(userId, thisMonthYear, thisMonth);
            Integer depressionScore = getDepressionScore(userId, thisMonthYear, thisMonth);
            Integer stressScore = getStressScore(userId, thisMonthYear, thisMonth);

            AllChartDataResponseDto.MonthlyResult result = new AllChartDataResponseDto.MonthlyResult(
                    thisMonthYear,
                    thisMonth,
                    anxietyScore,
                    depressionScore,
                    stressScore
            );

            log.info("이번달 자가진단 결과 조회 완료: {}", result);
            return result;
        }


        // =======================================================
        // === 개별 검사 점수 조회 ===
        // 불안 자가진단 점수 조회
        private Integer getAnxietyScore(Integer userId, Integer year, Integer month) {
            return anxietyRepository.findByUserUserIdAndAssessmentDateYearAndMonth(userId, year, month)
                    .map(AnxietySelfDiagnosis::getPercentage)
                    .orElse(null);
        }

        // 우울 자가진단 점수 조회
        private Integer getDepressionScore(Integer userId, Integer year, Integer month) {
            return depressionRepository.findByUserUserIdAndAssessmentDateYearAndMonth(userId, year, month)
                    .map(DepressionSelfDiagnosis::getPercentage)
                    .orElse(null);
        }

        // 스트레스 자가진단 점수 조회
        private Integer getStressScore(Integer userId, Integer year, Integer month) {
            return stressRepository.findByUserUserIdAndAssessmentDateYearAndMonth(userId, year, month)
                    .map(StressSelfDiagnosis::getPercentage)
                    .orElse(null);
        }
    }