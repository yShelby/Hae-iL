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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

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

    // =======================================================
    // Response to GetMapping :  검사 결과 조회
    // =======================================================
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


    // =======================================================
    // Response to PostMapping : 검사 점수 저장
    // =======================================================
    @Transactional
    public SelfDiagnosisDto.StatusResponse saveDiagnosisResult(Integer userId, String type, Integer totalScore){

        // 사용자 검색
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        switch (type) {
            // =======================================================
            // === 불안 검사 ===
            case "anxiety" :

                // === 1. 이전 검사들 중 available = true인 것만 false로 변경 ===
                // : 검사가 가능한 것 이외에는 available이 모두 false로 출력되어야 하기 때문
                List<AnxietySelfDiagnosis> AnxietyAvailableToUpdate = anxietyRepository
                        .findByUserUserIdAndAvailableTrue(userId); // available = true 조건

                if (!AnxietyAvailableToUpdate.isEmpty()) {
                    for (AnxietySelfDiagnosis test : AnxietyAvailableToUpdate) {
                        test.setAvailable(false);
                    }
                    anxietyRepository.saveAll(AnxietyAvailableToUpdate);
                    log.info("기존 불안 검사의 available = true {}건을 false로 변경", AnxietyAvailableToUpdate.size());
                }

                // === 2. 새 검사 저장 ===
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

            // =======================================================
            // === 우울 검사 ===
            case "depression" :
                // === 1. 이전 검사들 중 available = true인 것만 false로 변경 ===
                List<DepressionSelfDiagnosis> depressionAvailableToUpdate = depressionRepository
                        .findByUserUserIdAndAvailableTrue(userId); // available = true 조건

                if (!depressionAvailableToUpdate.isEmpty()) {
                    for (DepressionSelfDiagnosis test : depressionAvailableToUpdate) {
                        test.setAvailable(false);
                    }
                    depressionRepository.saveAll(depressionAvailableToUpdate);
                    log.info("기존 우울 검사의 available = true {}건을 false로 변경", depressionAvailableToUpdate.size());
                }

                // === 2. 새 검사 저장 ===
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

            // =======================================================
            // === 스트레스 검사 ===
            case "stress" :

                // === 1. 이전 검사들 중 available = true인 것만 false로 변경 ===
                List<StressSelfDiagnosis> StressAvailableToUpdate = stressRepository
                        .findByUserUserIdAndAvailableTrue(userId); // available = true 조건

                if (!StressAvailableToUpdate.isEmpty()) {
                    for (StressSelfDiagnosis test : StressAvailableToUpdate) {
                        test.setAvailable(false);
                    }
                    stressRepository.saveAll(StressAvailableToUpdate);
                    log.info("기존 스트레스 검사의 available = true {}건을 false로 변경", StressAvailableToUpdate.size());
                }

                // === 2. 새 검사 저장 ===
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


    // =======================================================
    // 스케줄러: 매일 자정 available 상태 업데이트
    // =======================================================

    @Scheduled(cron = "0 0 0 * * *")
    public void checkIsAvailableTest() {
        LocalDate today = LocalDate.now();
        log.info("자가진단 available 상태 체크 시작 - 날짜: {}", today);

        // 불안 검사 업데이트
        updateAnxietyAvailability(today);

        // 우울 검사 업데이트
        updateDepressionAvailability(today);

        // 스트레스 검사 업데이트
        updateStressAvailability(today);

        log.info("자가진단 available 상태 체크 완료");
    }

    // === 불안 검사 업데이트 함수 ===
    @Transactional
    private void updateAnxietyAvailability(LocalDate today) {
        List<Integer> userIds = anxietyRepository.findAllUserIds();
        List<AnxietySelfDiagnosis> testsToUpdate = new ArrayList<>();

        for (Integer userId : userIds) {
            // 각 사용자의 최신 검사 1건 조회
            Optional<AnxietySelfDiagnosis> latestTest = anxietyRepository
                    .findTopByUserUserIdOrderByAssessmentDateDesc(userId);

            if (latestTest.isPresent()) {
                AnxietySelfDiagnosis test = latestTest.get();
                boolean shouldBeAvailable = !test.getNextAvailableDate().isAfter(today);

                // 만약 이전 상태(false)와 지금 상태(true)가 다른 경우 : 검사 대기 기간 종료 (true로 변경)
                if (!test.getAvailable() && shouldBeAvailable) {
                    test.setAvailable(true);
                    testsToUpdate.add(test);
                    log.info("불안 검사 available 업데이트 - userId: {}, false → true, nextAvailableDate: {}, assessmentDate: {}",
                            userId, test.getNextAvailableDate(), test.getAssessmentDate());
                }
            }
        }

        if (!testsToUpdate.isEmpty()) {
            anxietyRepository.saveAll(testsToUpdate);
            log.info("불안 검사 {} 건 업데이트 완료", testsToUpdate.size());
        } else {
            log.info("불안 검사 업데이트할 데이터 없음");
        }
    }

    // === 우울 검사 업데이트 함수 ===
    @Transactional
    private void updateDepressionAvailability(LocalDate today) {
        List<Integer> userIds = depressionRepository.findAllUserIds();
        List<DepressionSelfDiagnosis> testsToUpdate = new ArrayList<>();

        for (Integer userId : userIds) {
            // 각 사용자의 최신 검사 1건 조회
            Optional<DepressionSelfDiagnosis> latestTest = depressionRepository
                    .findTopByUserUserIdOrderByAssessmentDateDesc(userId);

            if (latestTest.isPresent()) {
                DepressionSelfDiagnosis test = latestTest.get();
                boolean shouldBeAvailable = !test.getNextAvailableDate().isAfter(today);

                // 만약 이전 상태(false)와 지금 상태(true)가 다른 경우 : 검사 대기 기간 종료 (true로 변경)
                if (!test.getAvailable() && shouldBeAvailable) {
                    test.setAvailable(true);
                    testsToUpdate.add(test);
                    log.info("우울 검사 available 업데이트 - userId: {}, false → true, nextAvailableDate: {}, assessmentDate: {}",
                            userId, test.getNextAvailableDate(), test.getAssessmentDate());
                }
            }
        }

        if (!testsToUpdate.isEmpty()) {
            depressionRepository.saveAll(testsToUpdate);
            log.info("우울 검사 {} 건 업데이트 완료", testsToUpdate.size());
        } else {
            log.info("우울 검사 업데이트할 데이터 없음");
        }
    }

    // === 스트레스 검사 업데이트 함수 ===
    @Transactional
    private void updateStressAvailability(LocalDate today) {
        List<Integer> userIds = stressRepository.findAllUserIds();
        List<StressSelfDiagnosis> testsToUpdate = new ArrayList<>();

        for (Integer userId : userIds) {
            // 각 사용자의 최신 검사 1건 조회
            Optional<StressSelfDiagnosis> latestTest = stressRepository
                    .findTopByUserUserIdOrderByAssessmentDateDesc(userId);

            if (latestTest.isPresent()) {
                StressSelfDiagnosis test = latestTest.get();
                boolean shouldBeAvailable = !test.getNextAvailableDate().isAfter(today);

                // 만약 이전 상태(false)와 지금 상태(true)가 다른 경우 : 검사 대기 기간 종료 (true로 변경)
                if (!test.getAvailable() && shouldBeAvailable) {
                    test.setAvailable(true);
                    testsToUpdate.add(test);
                    log.info("스트레스 검사 available 업데이트 - userId: {}, false → true, nextAvailableDate: {}, assessmentDate: {}",
                            userId, test.getNextAvailableDate(), test.getAssessmentDate());
                }
            }
        }

        if (!testsToUpdate.isEmpty()) {
            stressRepository.saveAll(testsToUpdate);
            log.info("스트레스 검사 {} 건 업데이트 완료", testsToUpdate.size());
        } else {
            log.info("스트레스 검사 업데이트할 데이터 없음");
        }
    }

}
