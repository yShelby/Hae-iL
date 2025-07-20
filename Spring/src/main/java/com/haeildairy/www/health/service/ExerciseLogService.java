package com.haeildairy.www.health.service;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.auth.repository.UserRepository;
import com.haeildairy.www.health.dto.ExerciseLogDto;
import com.haeildairy.www.health.entity.ExerciseLog;
import com.haeildairy.www.health.repository.ExerciseLogRepository;
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
public class ExerciseLogService {

    private final ExerciseLogRepository exerciseLogRepository;
    private final UserRepository userRepository;

    /**
     * 🏋️‍♂️ 운동 기록 저장
     * 1️⃣ userId로 사용자 조회
     * 2️⃣ 해당 날짜 운동 기록이 존재하면 예외 발생
     * 3️⃣ 운동 기록 저장
     */
    @Transactional
    public ExerciseLogDto.Response saveExerciseLog(Integer userId, ExerciseLogDto.SaveRequest dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        exerciseLogRepository.findByUserUserIdAndExerciseDate(userId, dto.getExerciseDate())
                .ifPresent(e -> {
                    throw new IllegalStateException("해당 날짜에 이미 운동 기록이 존재합니다.");
                });

        ExerciseLog log = ExerciseLog.builder()
                .user(user)
                .exerciseDate(dto.getExerciseDate())
                .exerciseType(dto.getExerciseType())
                .duration(dto.getDuration())
                .intensity(dto.getIntensity())
                .build();

        ExerciseLog saved = exerciseLogRepository.save(log);
        return ExerciseLogDto.Response.fromEntity(saved);
    }

    /**
     * ✏️ 운동 기록 수정
     */
    @Transactional
    public ExerciseLogDto.Response updateExerciseLog(Long exerciseId, Integer userId, ExerciseLogDto.UpdateRequest dto) {
        ExerciseLog log = exerciseLogRepository.findById(exerciseId)
                .orElseThrow(() -> new NoSuchElementException("운동 기록을 찾을 수 없습니다."));

        if (!log.getUser().getUserId().equals(userId)) {
            throw new SecurityException("운동 기록 수정 권한이 없습니다.");
        }

        log.setExerciseDate(dto.getExerciseDate());
        log.setExerciseType(dto.getExerciseType());
        log.setDuration(dto.getDuration());
        log.setIntensity(dto.getIntensity());

        return ExerciseLogDto.Response.fromEntity(log);
    }

    /**
     * 🗑️ 운동 기록 삭제
     */
    @Transactional
    public void deleteExerciseLog(Long exerciseId, Integer userId) {
        ExerciseLog log = exerciseLogRepository.findById(exerciseId)
                .orElseThrow(() -> new NoSuchElementException("운동 기록을 찾을 수 없습니다."));

        if (!log.getUser().getUserId().equals(userId)) {
            throw new SecurityException("운동 기록 삭제 권한이 없습니다.");
        }

        exerciseLogRepository.delete(log);
    }

    /**
     * 🔍 날짜별 운동 기록 조회
     */
    public ExerciseLogDto.Response findExerciseLogByDate(Integer userId, LocalDate date) {
        return exerciseLogRepository.findByUserUserIdAndExerciseDate(userId, date)
                .map(ExerciseLogDto.Response::fromEntity)
                .orElse(null);
    }

}
