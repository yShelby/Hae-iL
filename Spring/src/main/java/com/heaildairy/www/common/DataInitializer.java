package com.heaildairy.www.common;

import com.heaildairy.www.dashboard.fortune.entity.FortuneEntity;
import com.heaildairy.www.dashboard.fortune.repository.FortuneRepository;
import com.heaildairy.www.dashboard.question.entity.DailyQuestionEntity;
import com.heaildairy.www.dashboard.question.repository.DailyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("dev") // 'dev' 프로필이 활성화될 때만 Spring Bean으로 등록되고 실행
public class DataInitializer {

    private final FortuneRepository fortuneRepository;
    private final DailyQuestionRepository dailyQuestionRepository;

    /**
     * Spring 애플리케이션이 완전히 준비된 후, 이 메서드가 자동으로 한 번 실행됩니다.
     * @PostConstruct 대신 ApplicationReadyEvent를 사용하면 트랜잭션을 더 안전하게 관리할 수 있습니다.
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional // 데이터베이스 작업을 하나의 트랜잭션으로 묶습니다.
    public void init() {
        initFortuneData();
        initDailyQuestion();
    }

    private void initFortuneData() {
        // 테이블이 비어있을 때만 데이터를 추가하여 중복 삽입을 방지
        // 'ddl-auto: create' 시에는 항상 비어있으므로 실행되고, 'update' 시에는 최초 한 번만 실행
        if (fortuneRepository.count() == 0) {
            System.out.println("[DataInitializer] 'dev' 프로필 감지. 포춘쿠키 초기 데이터를 추가합니다...");

            List<FortuneEntity> fortunes = Arrays.asList(
                    new FortuneEntity("오늘 하루는 당신에게 특별한 행운을 가져다줄 것입니다."),
                    new FortuneEntity("작은 변화가 큰 성공의 시작이 될 수 있습니다."),
                    new FortuneEntity("오랫동안 기다려온 좋은 소식이 당신을 찾아올 것입니다."),
                    new FortuneEntity("새로운 사람과의 만남이 당신에게 긍정적인 영향을 줄 것입니다."),
                    new FortuneEntity("오늘은 평소보다 더 자신감을 가져도 좋습니다."),
                    new FortuneEntity("당신의 노력이 곧 빛을 발할 것입니다."),
                    new FortuneEntity("가끔은 쉬어가는 것도 괜찮아요. 당신은 충분히 잘하고 있어요."),
                    new FortuneEntity("웃음은 최고의 보약입니다. 오늘 하루 많이 웃으세요!"),
                    new FortuneEntity("뜻밖의 행운이 당신을 기다리고 있습니다."),
                    new FortuneEntity("당신이 가는 길이 바로 정답입니다. 스스로를 믿으세요.")
                    // 여기에 계속해서 원하는 글귀들을 추가
            );

            // 리스트에 담긴 모든 데이터를 한 번에 저장
            fortuneRepository.saveAll(fortunes);
            System.out.println("[DataInitializer] " + fortunes.size() + "개의 포춘쿠키 메시지가 추가되었습니다.");
        } else {
            System.out.println("[DataInitializer] 'dev' 프로필 감지. 이미 데이터가 존재하므로 초기화를 건너뜁니다.");
        }
    }

    private void initDailyQuestion() {
        LocalDate today = LocalDate.now();

        boolean existsTodayQuestion = dailyQuestionRepository.existsByDate(today);

        if (!existsTodayQuestion) {
            System.out.println("[DataInitializer] 오늘 날짜의 질문이 없어 기본 질문을 추가합니다.");

            DailyQuestionEntity question = new DailyQuestionEntity("오늘 나는 무엇에 감사했는가?", today);

            dailyQuestionRepository.save(question);
            System.out.println("[DataInitializer] 기본 질문이 추가되었습니다.");
        } else {
            System.out.println("[DataInitializer] 오늘 날짜의 질문이 이미 존재합니다. 초기화를 건너뜁니다.");
        }
    }
}
