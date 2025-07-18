package com.haeildiary.www.health.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.dashboard.todolist.service.TodoListService;
import com.haeildiary.www.health.dto.ExerciseLogDto;
import com.haeildiary.www.health.entity.ExerciseLog;
import com.haeildiary.www.health.repository.ExerciseLogRepository;
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
    private final TodoListService todoListService; // ✅ 추가: 의존성 주입

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

        ExerciseLog exerciseLog = ExerciseLog.builder()
                .user(user)
                .exerciseDate(dto.getExerciseDate())
                .exerciseType(dto.getExerciseType())
                .duration(dto.getDuration())
                .intensity(dto.getIntensity())
                .build();

        try {
            if (dto.getExerciseDate().isEqual(LocalDate.now())) {
                todoListService.markAsCompleted(userId, "exercise");
            }
        } catch (Exception e) {
            log.error("운동 기록 저장 후 TodoList 업데이트 실패: {}", e.getMessage());
        }


        ExerciseLog saved = exerciseLogRepository.save(exerciseLog);
        return ExerciseLogDto.Response.fromEntity(saved);
    }

    /**
     * ✏️ 운동 기록 수정
     */
    @Transactional
    public ExerciseLogDto.Response updateExerciseLog(Long exerciseId, Integer userId, ExerciseLogDto.UpdateRequest dto) {
        ExerciseLog exerciseLog = exerciseLogRepository.findById(exerciseId)
                .orElseThrow(() -> new NoSuchElementException("운동 기록을 찾을 수 없습니다."));

        if (!exerciseLog.getUser().getUserId().equals(userId)) {
            throw new SecurityException("운동 기록 수정 권한이 없습니다.");
        }

        exerciseLog.setExerciseDate(dto.getExerciseDate());
        exerciseLog.setExerciseType(dto.getExerciseType());
        exerciseLog.setDuration(dto.getDuration());
        exerciseLog.setIntensity(dto.getIntensity());

        // 수정 시에도 미션 완료 로직 추가
        try {
            if (dto.getExerciseDate().isEqual(LocalDate.now())) {
                todoListService.markAsCompleted(userId, "exercise");
            }
        } catch (Exception e) {
            log.error("운동 기록 수정 후 TodoList 업데이트 실패: {}", e.getMessage());
        }

        return ExerciseLogDto.Response.fromEntity(exerciseLog);
    }

    /**
     * 🗑️ 운동 기록 삭제
     */
    @Transactional
    public void deleteExerciseLog(Long exerciseId, Integer userId) {
        ExerciseLog exerciseLog = exerciseLogRepository.findById(exerciseId)
                .orElseThrow(() -> new NoSuchElementException("운동 기록을 찾을 수 없습니다."));

        if (!exerciseLog.getUser().getUserId().equals(userId)) {
            throw new SecurityException("운동 기록 삭제 권한이 없습니다.");
        }

        LocalDate exerciseDate = exerciseLog.getExerciseDate(); // ✅ 삭제 전에 날짜 정보 저장
        exerciseLogRepository.delete(exerciseLog);

        try {
            if (exerciseDate.isEqual(LocalDate.now())) {
                todoListService.markAsIncomplete(userId, "exercise");
            }
        } catch (Exception e) {
            log.error("운동 기록 삭제 후 TodoList 업데이트 실패: {}", e.getMessage());
        }
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
