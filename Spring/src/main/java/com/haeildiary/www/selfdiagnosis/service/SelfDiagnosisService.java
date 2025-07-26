package com.haeildiary.www.selfdiagnosis.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.selfdiagnosis.dto.SelfDiagnosisDto;
import com.haeildiary.www.selfdiagnosis.entity.AnxietySelfDiagnosis;
import com.haeildiary.www.selfdiagnosis.entity.DepressionSelfDiagnosis;
import com.haeildiary.www.selfdiagnosis.entity.StressSelfDiagnosis;
import com.haeildiary.www.selfdiagnosis.repository.AnxietyRepository;
import com.haeildiary.www.selfdiagnosis.repository.DepressionRepository;
import com.haeildiary.www.selfdiagnosis.repository.StressRepository;
import com.haeildiary.www.selfdiagnosis.util.CalculateUtil;
import com.haeildiary.www.selfdiagnosis.util.DiagnosisResultUtil;
import com.haeildiary.www.selfdiagnosis.util.StatusUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SelfDiagnosisService {

    private final UserRepository userRepository;
    private final AnxietyRepository anxietyRepository;
    private final DepressionRepository depressionRepository;
    private final StressRepository stressRepository;
    private final StatusUtil statusUtil;

    // Response to GetMapping :  검사 결과 조회
    public SelfDiagnosisDto.AllStatusResponse getDiagnosisStatus(Integer userId, Integer year, Integer month) {

        // 사용자 검색
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        // 각 진단별 상태 조회
        SelfDiagnosisDto.StatusResponse anxietyStatus = statusUtil.getDiagnosisStatus(
                anxietyRepository, userId, year, month);

        log.info("불안검사 호출 : {}", anxietyStatus);

        SelfDiagnosisDto.StatusResponse depressionStatus = statusUtil.getDiagnosisStatus(
                depressionRepository, userId, year, month);

        log.info("우울검사 호출 : {}", depressionStatus);

        SelfDiagnosisDto.StatusResponse stressStatus = statusUtil.getDiagnosisStatus(
                stressRepository, userId, year, month);

        log.info("스트레스검사 호출 : {}", stressStatus);

        return SelfDiagnosisDto.AllStatusResponse.builder()
                .anxiety(anxietyStatus)
                .depression(depressionStatus)
                .stress(stressStatus)
                .build();

    }


    // Response to PostMapping : 검사 점수 저장
    @Transactional
    public SelfDiagnosisDto.StatusResponse saveDiagnosisResult(Integer userId, String type, Integer totalScore){

        // 사용자 검색
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        switch (type) {
            case "anxiety" :
                // 불안 검사 총점
                Integer anxietyMax = 27;
                // total score를 percentage로 변환
                Integer anxietyPercentage = CalculateUtil.calculatePercentage(totalScore, anxietyMax);

                // total score에 따른 결과 도출
                String anxietyResult = DiagnosisResultUtil.anxietyResult(totalScore);

                // 다음 검사일
                LocalDate nextAnxietyTestDate = CalculateUtil.calculateNextAvailableDate();

                log.info("불안 검사 저장 - 점수: {}, 퍼센트: {}%, 결과: {}, 다음 검사일 : {}", totalScore, anxietyPercentage, anxietyResult, nextAnxietyTestDate);

                // 결과를 Anxiety Repository에 전달
                // Entity builder
                AnxietySelfDiagnosis anxietyEntity = AnxietySelfDiagnosis.builder()
                        .user(user)
                        .available(false)
                        .totalScore(totalScore)
                        .percentage(anxietyPercentage)
                        .result(anxietyResult)
                        .nextAvailableDate(nextAnxietyTestDate)
                        .build();

                // Entity에 저장
                anxietyRepository.save(anxietyEntity);

                return SelfDiagnosisDto.StatusResponse.builder()
                        .available(false)
                        .percentage(anxietyPercentage)
                        .result(anxietyResult)
                        .nextAvailableDate(nextAnxietyTestDate)
                        .build();

            case "depression" :
                // 우울 검사 총점
                Integer depressionMax = 21;
                // total score를 percentage로 변환
                Integer depressionPercentage = CalculateUtil.calculatePercentage(totalScore, depressionMax);

                // total score에 따른 결과 도출
                String depressionResult = DiagnosisResultUtil.depressionResult(totalScore);

                // 다음 검사일
                LocalDate nextDepressionTestDate = CalculateUtil.calculateNextAvailableDate();

                log.info("우울 검사 저장 - 점수: {}, 퍼센트: {}%, 결과: {}, 다음 검사일 : {}", totalScore, depressionPercentage, depressionResult, nextDepressionTestDate);

                // 결과를 Depression Repository에 전달
                // Entity builder
                DepressionSelfDiagnosis depressionEntity = DepressionSelfDiagnosis.builder()
                        .user(user)
                        .available(false)
                        .totalScore(totalScore)
                        .percentage(depressionPercentage)
                        .result(depressionResult)
                        .nextAvailableDate(nextDepressionTestDate)
                        .build();

                // Entity에 저장
                depressionRepository.save(depressionEntity);

                // React로 return할 데이터
                return SelfDiagnosisDto.StatusResponse.builder()
                        .available(false)
                        .percentage(depressionPercentage)
                        .result(depressionResult)
                        .nextAvailableDate(nextDepressionTestDate)
                        .build();

            case "stress" :
                // 스트레스 검사 총점
                Integer stressMax = 40;
                // total score를 percentage로 변환
                Integer stressPercentage = CalculateUtil.calculatePercentage(totalScore, stressMax);

                // total score에 따른 결과 도출
                String stressResult = DiagnosisResultUtil.stressResult(totalScore);

                // 다음 검사일
                LocalDate nextStressTestDate = CalculateUtil.calculateNextAvailableDate();

                log.info("스트레스 검사 저장 - 점수: {}, 퍼센트: {}%, 결과: {}, 다음 검사일 : {}", totalScore, stressPercentage, stressResult, nextStressTestDate);

                // 결과를 Stress Repository에 반환
                // Entity builder
                StressSelfDiagnosis stressEntity = StressSelfDiagnosis.builder()
                        .user(user)
                        .available(false)
                        .totalScore(totalScore)
                        .percentage(stressPercentage)
                        .result(stressResult)
                        .nextAvailableDate(nextStressTestDate)
                        .build();

                // Entity에 저장
                stressRepository.save(stressEntity);

                return SelfDiagnosisDto.StatusResponse.builder()
                        .available(false)
                        .percentage(stressPercentage)
                        .result(stressResult)
                        .nextAvailableDate(nextStressTestDate)
                        .build();

            default : throw new IllegalArgumentException("요청하신 검사의 타입을 알 수 없습니다 : " + type);
        }

    }

// 매일 오전 0시에 실행
//    @Scheduled(cron = "0 0 0 * * *")
//    public void checkIsAvaiableTest() {
//        LocalDateTime threshold = LocalDateTime.now().minusMonths(1);
//        disLikeMoviesRepository.deleteOldDislikes(threshold);
//        log.info("한 달 지난 싫어요 영화 데이터를 삭제했습니다.");
//    }

}
