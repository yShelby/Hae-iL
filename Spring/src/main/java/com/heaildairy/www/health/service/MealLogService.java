package com.heaildairy.www.health.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.health.dto.MealLogDto;
import com.heaildairy.www.health.entity.MealLog;
import com.heaildairy.www.health.repository.MealLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MealLogService {

    private final MealLogRepository mealLogRepository;
    private final UserRepository userRepository;

    /**
     * 🍱 식사 기록 저장
     */
    @Transactional
    public MealLogDto.Response saveMealLog(Integer userId, MealLogDto.SaveRequest dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. userId: " + userId));

        mealLogRepository.findByUserUserIdAndMealDate(userId, dto.getMealDate())
                .ifPresent(m -> {
                    throw new IllegalStateException("해당 날짜에 이미 식사 기록이 존재합니다. mealDate: " + dto.getMealDate());
                });

        MealLog mealLog = MealLog.builder()
                .user(user)
                .mealDate(dto.getMealDate())
                .breakfast(dto.getBreakfast())
                .lunch(dto.getLunch())
                .dinner(dto.getDinner())
                .snack(dto.getSnack())
                .build();

        MealLog saved = mealLogRepository.save(mealLog);
        return MealLogDto.Response.fromEntity(saved);
    }

    /**
     * ✏️ 식사 기록 수정
     */
    @Transactional
    public MealLogDto.Response updateMealLog(Long mealId, Integer userId, MealLogDto.UpdateRequest dto) {
        MealLog mealLog = mealLogRepository.findById(mealId)
                .orElseThrow(() -> new NoSuchElementException("식사 기록을 찾을 수 없습니다. mealId: " + mealId));

        if (!mealLog.getUser().getUserId().equals(userId)) {
            throw new SecurityException("해당 식사 기록에 대한 권한이 없습니다.");
        }

        mealLog.setMealDate(dto.getMealDate());
        mealLog.setBreakfast(dto.getBreakfast());
        mealLog.setLunch(dto.getLunch());
        mealLog.setDinner(dto.getDinner());
        mealLog.setSnack(dto.getSnack());

        return MealLogDto.Response.fromEntity(mealLog);
    }

    /**
     * 🗑️ 식사 기록 삭제
     */
    @Transactional
    public void deleteMealLog(Long mealId, Integer userId) {
        MealLog mealLog = mealLogRepository.findById(mealId)
                .orElseThrow(() -> new NoSuchElementException("식사 기록을 찾을 수 없습니다. mealId: " + mealId));

        if (!mealLog.getUser().getUserId().equals(userId)) {
            throw new SecurityException("해당 식사 기록에 대한 권한이 없습니다.");
        }

        mealLogRepository.delete(mealLog);
    }

    /**
     * 🔍 날짜별 식사 기록 조회
     */
    public MealLogDto.Response findMealLogByDate(Integer userId, LocalDate date) {
        return mealLogRepository.findByUserUserIdAndMealDate(userId, date)
                .map(MealLogDto.Response::fromEntity)
                .orElse(null);
    }

}
