package com.heaildairy.www.health.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.health.dto.SleepLogDto;
import com.heaildairy.www.health.entity.SleepLog;
import com.heaildairy.www.health.repository.SleepLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SleepLogService {
    private final SleepLogRepository sleepLogRepository;
    private final UserRepository userRepository;

    /**
     * 🛌 수면 기록 저장
     * 1️⃣ userId로 사용자 조회
     * 2️⃣ 해당 날짜 수면 기록이 존재하면 예외 발생
     * 3️⃣ 수면 기록 저장
     */
    @Transactional
    public SleepLogDto.Response saveSleepLog(Integer userId, SleepLogDto.SaveRequest dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        sleepLogRepository.findByUserUserIdAndSleepDate(userId, dto.getSleepDate())
                .ifPresent(s-> {
                    throw new IllegalStateException("해당 날짜에 이미 수면 기록이 존재합니다. sleepDate: " + dto.getSleepDate());
                });

        SleepLog sleepLog = SleepLog.builder()
                .user(user)
                .sleepDate(dto.getSleepDate())
                .bedtime(dto.getBedtime())
                .waketime(dto.getWaketime())
                .totalHours(calculateSleepHours(dto.getBedtime(), dto.getWaketime()))
                .build();

        SleepLog saved = sleepLogRepository.save(sleepLog);

        return SleepLogDto.Response.fromEntity(saved);
    }

    /**
     * ✏️ 수면 기록 수정
     */
    @Transactional
    public SleepLogDto.Response updateSleepLog(Long sleepId, Integer userId, SleepLogDto.UpdateRequest dto) {
        SleepLog sleepLog = sleepLogRepository.findById(sleepId)
                .orElseThrow(() -> new NoSuchElementException("Sleep log not found with id: " + sleepId));

        if (!sleepLog.getUser().getUserId().equals(userId)) {
            throw new SecurityException("해당 수면 기록에 대한 권한이 없습니다. userId: " + userId);
        }

        sleepLog.setSleepDate(dto.getSleepDate());
        sleepLog.setBedtime(dto.getBedtime());
        sleepLog.setWaketime(dto.getWaketime());
        sleepLog.setTotalHours(calculateSleepHours(dto.getBedtime(), dto.getWaketime()));

        return SleepLogDto.Response.fromEntity(sleepLog);
    }


    /**
     * 🗑️ 수면 기록 삭제
     */
    @Transactional
    public void deleteSleepLog(Long sleepId, Integer userId) {
        SleepLog sleepLog = sleepLogRepository.findById(sleepId)
                .orElseThrow(() -> new NoSuchElementException("Sleep log not found with id: " + sleepId));

        if (!sleepLog.getUser().getUserId().equals(userId)) {
            throw new SecurityException("User does not have permission to delete this sleep log.");
        }

        sleepLogRepository.delete(sleepLog);
    }

    /**
     * 🔍 날짜별 수면 기록 조회
     */
    public SleepLogDto.Response findSleepLogByDate(Integer userId, LocalDate date) {
        return sleepLogRepository.findByUserUserIdAndSleepDate(userId, date)
                .map(SleepLogDto.Response::fromEntity)
                .orElse(null);
    }

    /**
     * ⏰ 총 수면 시간 계산 (bedtime ~ waketime)
     */
    private Double calculateSleepHours(java.time.LocalTime bedtime, java.time.LocalTime waketime) {
        if (bedtime == null || waketime == null) return null;

        Duration duration = Duration.between(bedtime, waketime);
        double hours = duration.toMinutes() / 60.0;

        // 자정 넘는 경우 보정
        if (hours < 0) hours += 24.0;
        // 유효하지 않은 시간 처리
        if (hours <= 0 || hours > 24) {
            throw new IllegalArgumentException("수면 시간이 유효하지 않습니다.");
        }

        return Math.round(hours * 10.0) / 10.0;
    }
}
