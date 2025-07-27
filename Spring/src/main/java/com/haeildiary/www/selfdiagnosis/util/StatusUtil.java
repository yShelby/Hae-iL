package com.haeildiary.www.selfdiagnosis.util;

import com.haeildiary.www.selfdiagnosis.common.CommonSelfDiagnosisRepository;
import com.haeildiary.www.selfdiagnosis.common.CommonStatusAccessor;
import com.haeildiary.www.selfdiagnosis.dto.SelfDiagnosisDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class StatusUtil {

    // Get Diagnosis Status 로직
    // 1. Front에서 받은 연-월이 Server에서 생성한 오늘 연-월과 일치한다.
    //    -> 결과 날짜(assessment date)를 내림차순으로 정렬해 가장 최근에 저장된 available 컬럼을 조회한다.
    //    -> available true : available true만 반환
    //    -> available false : available false + percentage + result + nextAvailableDate
    // 2. Front에서 받은 연-월이 Server에서 생성한 오늘 연-월과 일치하지 않는다.
    //    -> 검사를 하지 않았으면 : available false + message("이 달엔 검사를 하지 않았어요")
    //    -> 검사를 했으면 : available false + percentage + result

    /**
     * 자가진단 상태 조회 공통 로직
     * @param repository : 해당 진단 타입의 Repository
     * @param userId : 사용자 ID
     * @param year : 조회할 연도
     * @param month : 조회할 월
     * @param <T> : 진단 엔티티 타입
     * @return StatusResponse
     */

    public <T extends CommonStatusAccessor> SelfDiagnosisDto.StatusResponse getDiagnosisStatus(
            CommonSelfDiagnosisRepository<T> repository,
            Integer userId,
            Integer year,
            Integer month) {

        // 현재 서버 시간 기준 연-월 가져오기
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();

        // 1. Front에서 받은 연-월이 Server에서 생성한 오늘 연-월과 일치하는지 확인
        if (year == currentYear && month == currentMonth) {
            return handleCurrentMonth(repository, userId); // 현재 달인 경우 - 가장 최근 검사의 available 상태만 확인
        } else {
            // 2. 현재 달이 아닌 경우 (과거 달)
            return handlePastMonth(repository, userId, year, month); // 해당 월 검색 후 메세지 또는 결과 반환
        }

    }

    //========================
    // 1) 현재 달 처리
    private <T extends CommonStatusAccessor> SelfDiagnosisDto.StatusResponse handleCurrentMonth(
            CommonSelfDiagnosisRepository<T> repository,
            Integer userId) {

        // 가장 최근에 저장된 결과 조회 (assessment date 기준)
        Optional<T> recentDiagnosis = repository.findTopByUserUserIdOrderByAssessmentDateDesc(userId);

        if (recentDiagnosis.isEmpty()) {
            // 검사 이력이 아예 없으면 바로 검사 가능
            return SelfDiagnosisDto.StatusResponse.builder()
                    .available(true)
                    .build();
        }

        T latestDiagnosis = recentDiagnosis.get();

        if (Boolean.TRUE.equals(latestDiagnosis.getAvailable())) {
            // available이 true면 검사 가능
            return SelfDiagnosisDto.StatusResponse.builder()
                    .available(latestDiagnosis.getAvailable()) // true
                    .build();
        } else {
            // available이 false면 검사 불가능, 최근 결과 반환
            return SelfDiagnosisDto.StatusResponse.builder()
                    .available(latestDiagnosis.getAvailable()) // false
                    .percentage(latestDiagnosis.getPercentage())
                    .result(latestDiagnosis.getResult())
                    .nextAvailableDate(latestDiagnosis.getNextAvailableDate())
                    .build();
        }
    }

    // 2) 과거 달 처리
    private <T extends CommonStatusAccessor> SelfDiagnosisDto.StatusResponse handlePastMonth(
            CommonSelfDiagnosisRepository<T> repository,
            Integer userId,
            Integer year,
            Integer month) {

        Optional<T> pastDiagnosis = repository.findByUserUserIdAndAssessmentDateYearAndMonth(userId, year, month);

        if (pastDiagnosis.isEmpty()) {
            // 검사를 하지 않았던 경우
            return SelfDiagnosisDto.StatusResponse.builder()
                    .available(false) // 강제로 false 송출
                    .message("이 달엔 검사를 하지 않았어요")
                    .build();
        } else {
            // 검사를 했던 경우
            T diagnosis = pastDiagnosis.get();
            return SelfDiagnosisDto.StatusResponse.builder()
                    .available(false) // 강제로 false 송출
                    .percentage(diagnosis.getPercentage())
                    .result(diagnosis.getResult())
                    .build();
        }
    }
}
