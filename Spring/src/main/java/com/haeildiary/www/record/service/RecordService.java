package com.haeildiary.www.record.service;

import com.haeildiary.www.diary.repository.DiaryRepository;
import com.haeildiary.www.journal.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 여러 도메인(Diary, Journal 등)의 데이터를 조합하여
 * '기록'이라는 새로운 의미를 만들어내는 서비스 클래스
 * 이는 '관심사의 분리' 원칙을 따르는 설계
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 데이터를 조회만 하므로 readOnly=true로 설정하여 성능을 최적화
public class RecordService {

    private final DiaryRepository diaryRepository;
    private final JournalRepository journalRepository;

    /**
     * 특정 사용자의 특정 월에 대한 저널 및 일기 작성 날짜를 조회
     * @param userId    사용자 ID
     * @param year      조회할 연도
     * @param month     조회할 월
     * @return          Map<Integer, String> 형태의 데이터. Key는 일(day), Value는 기록 타입("journal", "diary", "both")
     */
    public Map<Integer, String> getRecordedDatesInMonth(Integer userId, int year, int month) {
        // 기간 계산
        // 조회할 월의 시작일과 마지막일을 계산하여 DB 조회 범위를 한정
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // 1. 각 Repository를 통해 해당 월의 저널 작성일과 일기 작성일을 각각 조회
        List<LocalDate> journalDates = journalRepository.findDistinctByUserIdAndDateBetween(userId, startDate, endDate);
        List<LocalDate> diaryDates = diaryRepository.findDistinctByUserIdAndDateBetween(userId, startDate, endDate);

        // 결과를 담을 HashMap을 생성
        Map<Integer, String> recordedDates = new HashMap<>();

        // 데이터 조합 (1) - 저널
        // 2. 저널 작성일을 순회하며 map에 "journal"로 기록
        journalDates.forEach(date -> recordedDates.put(date.getDayOfMonth(), "journal"));

        // 데이터 조합 (2) - 일기 (merge 활용)
        // 3. 일기 작성일을 순회하며 map에 기록
        diaryDates.forEach(date -> {
            int day = date.getDayOfMonth();
            // merge 함수를 사용하여 키(날짜)가 이미 존재하는지 확인
            // - 존재하지 않으면: "diary"를 값으로 새로 추가
            // - 존재하면 (즉, 이미 저널이 기록되어 있으면): 기존 값("journal")과 새 값("diary")을 합쳐 "both"로 업데이트
            //   이 방식은 if-else 분기문을 사용하는 것보다 간결하고 효율적
            recordedDates.merge(day, "diary", (existingValue, newValue) -> "both");
        });

        return recordedDates;
    }
}
