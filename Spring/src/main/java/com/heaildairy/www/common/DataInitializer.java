package com.heaildairy.www.common;

import com.heaildairy.www.dashboard.fortune.entity.FortuneEntity;
import com.heaildairy.www.dashboard.fortune.repository.FortuneRepository;
import com.heaildairy.www.dashboard.question.entity.DailyQuestionEntity;
import com.heaildairy.www.dashboard.question.repository.DailyQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("dev") // 'dev' 프로필이 활성화될 때만 Spring Bean으로 등록되고 실행
public class DataInitializer {

    private final FortuneRepository fortuneRepository;
    private final DailyQuestionRepository dailyQuestionRepository;
    // classpath에 있는 리소스 파일을 읽기 위해 ResourceLoader를 주입
    private final ResourceLoader resourceLoader;

    /**
     * Spring 애플리케이션이 완전히 준비된 후, 이 메서드가 자동으로 한 번 실행된다
     * @PostConstruct 대신 ApplicationReadyEvent를 사용하면 트랜잭션을 더 안전하게 관리 가능
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        initData("포춘쿠키", fortuneRepository, "data/fortunes.csv", FortuneEntity.class);
        initData("오늘의 질문", dailyQuestionRepository, "data/questions.csv", DailyQuestionEntity.class);
    }

    /**
     * 데이터 초기화 로직을 제네릭을 사용하여 공통화
     * @param dataType 데이터 종류 이름 (로깅용)
     * @param repository 데이터를 저장할 Repository
     * @param filePath CSV 파일 경로 (classpath 기준)
     * @param entityType 생성할 엔티티 클래스 타입
     * @param <T> 엔티티 타입
     * @param <R> Repository 타입
     */
    private <T, R extends org.springframework.data.repository.Repository<?, ?>> void initData(
            String dataType, R repository, String filePath, Class<T> entityType) {

        // Spring Data JPA의 Repository는 count() 메소드를 기본 제공
        long count = ((org.springframework.data.repository.CrudRepository<?, ?>) repository).count();

        if (count == 0) {
            log.info("[DataInitializer] '{}' 데이터가 없어 '{}' 파일에서 데이터를 추가합니다.", dataType, filePath);
            try {
                // CSV 파일에서 데이터를 읽어와 엔티티 리스트로 변환
                Resource resource = resourceLoader.getResource("classpath:" + filePath);
                // BufferedReader를 사용하여 파일을 한 줄씩 효율적으로 읽는다.
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                    List<T> entities = reader.lines()
                            .map(line -> {
                                try {
                                    // 엔티티 클래스의 생성자(String)를 호출하여 객체를 생성
                                    return entityType.getConstructor(String.class).newInstance(line);
                                } catch (Exception e) {
                                    throw new RuntimeException("엔티티 생성 중 오류 발생: " + line, e);
                                }
                            })
                            .collect(Collectors.toList());

                    // 변환된 모든 엔티티를 데이터베이스에 한 번에 저장
                    ((org.springframework.data.jpa.repository.JpaRepository<T, ?>) repository).saveAll(entities);
                    log.info("[DataInitializer] {}개의 '{}' 데이터가 추가되었습니다.", entities.size(), dataType);
                }
            } catch (IOException e) {
                log.error("[DataInitializer] '{}' 파일 로딩 중 오류가 발생했습니다.", filePath, e);
            }
        } else {
            log.info("[DataInitializer] '{}' 데이터가 이미 존재하므로 초기화를 건너뜁니다.", dataType);
        }
    }
}