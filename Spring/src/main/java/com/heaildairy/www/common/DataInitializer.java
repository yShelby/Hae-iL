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
        if (dailyQuestionRepository.count() == 0) {
            System.out.println("[DataInitializer] '오늘의 질문' 데이터가 없어 기본 질문 목록을 추가합니다.");

            List<DailyQuestionEntity> questions = Arrays.asList(
                    new DailyQuestionEntity("오늘 하루, 스스로에게 가장 칭찬해주고 싶은 점은 무엇인가요?"),
                    new DailyQuestionEntity("최근 나를 가장 편안하게 만들어준 것은 무엇이었나요?"),
                    new DailyQuestionEntity("사소하지만 오늘 나를 미소 짓게 한 순간이 있었나요?"),
                    new DailyQuestionEntity("요즘 나의 마음을 가장 잘 표현하는 단어는 무엇인가요?"),
                    new DailyQuestionEntity("1년 전의 나에게 해주고 싶은 조언이 있다면 무엇인가요?"),
                    new DailyQuestionEntity("오늘 하루, 어떤 감정을 가장 강하게 느꼈나요?"),
                    new DailyQuestionEntity("나의 어떤 점이 가장 자랑스러운가요?"),
                    new DailyQuestionEntity("최근에 새롭게 배우거나 깨달은 것이 있나요?"),
                    new DailyQuestionEntity("나에게 '쉼'이란 어떤 의미인가요?"),
                    new DailyQuestionEntity("내일의 나에게 어떤 기대를 하고 있나요?")
            );

            dailyQuestionRepository.saveAll(questions);
            System.out.println("[DataInitializer] " + questions.size() + "개의 '오늘의 질문' 데이터가 추가되었습니다.");
        } else {
            System.out.println("[DataInitializer] '오늘의 질문' 데이터가 이미 존재하므로 초기화를 건너뜁니다.");
        }
    }
}