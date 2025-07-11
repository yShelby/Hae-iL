package com.heaildairy.www.dashboard.fortune.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.dashboard.fortune.dto.FortuneDto;
import com.heaildairy.www.dashboard.fortune.entity.FortuneEntity;
import com.heaildairy.www.dashboard.fortune.repository.FortuneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class FortuneService {

    private final UserRepository userRepository;
    private final FortuneRepository fortuneRepository;

    /**
     * 사용자의 오늘 포춘쿠키 상태를 조회합니다.
     * @param userId 현재 로그인한 사용자의 ID
     * @return 오늘의 쿠키를 열 수 있는지 여부와, 이미 열었다면 확인한 메시지를 담은 Dto
     */
    @Transactional(readOnly = true) // 데이터 변경이 없는 조회 전용 트랜잭션
    public FortuneDto.StatusResponse getFortuneStatus(Integer userId) {
        // 1. 사용자 정보 조회
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        LocalDate today = LocalDate.now();
        LocalDate lastOpenedDate = user.getLastFortuneOpenedDate();

        // 2. 오늘 날짜와 마지막으로 쿠키를 연 날짜를 비교
        if (lastOpenedDate != null && lastOpenedDate.isEqual(today)) {
            // 오늘 이미 열었다면, 열 수 없음 상태와 함께 메시지 반환
            return FortuneDto.StatusResponse.builder()
                    .canOpen(false)
                    // TODO: 이전에 뽑았던 메시지를 저장하고 반환하는 기능은 추후 확장 가능
                    .message("오늘은 이미 운세를 확인했어요.")
                    .build();
        }

        // 3. 아직 열지 않았다면, 열 수 있음 상태 반환
        return FortuneDto.StatusResponse.builder().canOpen(true).build();
    }

    /**
     * 사용자가 포춘쿠키를 엽니다. (운세 메시지를 랜덤으로 뽑고, 오늘 날짜를 기록합니다)
     * @param userId 현재 로그인한 사용자의 ID
     * @return 새로 뽑은 운세 메시지를 담은 Dto
     */
    public FortuneDto.OpenResponse openFortuneCookie(Integer userId) {
        // 1. 사용자 정보 조회
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // 2. 오늘 이미 열었는지 다시 한번 확인 (동시성 문제 방지)
        LocalDate today = LocalDate.now();
        LocalDate lastOpenedDate = user.getLastFortuneOpenedDate();

        if (lastOpenedDate != null && lastOpenedDate.isEqual(today)) {
            // 동시 다발적인 요청으로 쿠키를 여러 번 여는 것을 방지하기 위해,
            // 상태를 확인하고 이미 열었다면 더 구체적인 예외를 발생시킵니다.
            throw new IllegalStateException("오늘 이미 포춘쿠키를 사용했어요.");
        }

        // 3. DB에서 랜덤 운세 메시지 조회
        // Optional.map을 사용하여 코드를 더 간결하고 안전하게 만들었습니다.
        // fortuneRepository가 비어있는 Optional을 반환하더라도, orElse 구문을 통해
        // NullPointerException 없이 안전하게 기본 메시지를 제공합니다.
        String message = fortuneRepository.findRandomFortune()
                .map(FortuneEntity::getMessage) // FortuneEntity에서 메시지만 추출
                .orElse("내일은 더 좋은 일이 생길 거예요."); // DB에 운세가 하나도 없을 경우를 대비한 기본 메시지

        // 4. 사용자의 마지막 쿠키 확인 날짜를 오늘로 업데이트
        user.updateLastFortuneOpenedDate(today);

        return new FortuneDto.OpenResponse(message);
    }
}
