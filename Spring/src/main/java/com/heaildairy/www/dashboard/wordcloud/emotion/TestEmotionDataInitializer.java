package com.heaildairy.www.dashboard.wordcloud.emotion;

import com.heaildairy.www.dashboard.wordcloud.emotion.entity.TestMoodDetailEntity;
import com.heaildairy.www.dashboard.wordcloud.emotion.respository.TestEmotionRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class TestEmotionDataInitializer implements CommandLineRunner {

    private final TestEmotionRepository testEmotionRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // DB에 이미 데이터가 있는지 확인하여, 데이터가 비어있을 때만 초기화
        if (testEmotionRepository.count() == 0) {
            log.info("[DataInitializer] 감정 데이터를 초기화합니다...");
            loadCsvData();
            log.info("[DataInitializer] 감정 데이터 초기화 완료.");
        } else {
            log.info("[DataInitializer] 감정 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
        }
    }

    private void loadCsvData() throws IOException, CsvValidationException {
        // 'src/main/resources' 경로의 CSV 파일을 읽어온다.
        ClassPathResource resource = new ClassPathResource("data/test_emotions.csv");

        // CSVReader를 사용하여 파일을 한 줄씩 읽는다. UTF-8 인코딩을 명시
        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String[] line;
            while ((line = reader.readNext()) != null) {
                // 예외 방지: CSV 파일의 각 줄이 3개의 컬럼을 가지고 있는지 확인
                if (line.length < 3) {
                    log.warn("잘못된 형식의 CSV 라인을 건너뜁니다: {}", (Object) line);
                    continue;
                }

                try {
                    String keyword = line[0];
                    String sentiment = line[1];
                    Integer value = Integer.parseInt(line[2]);

                    TestMoodDetailEntity emotion = new TestMoodDetailEntity(keyword, value, sentiment);
                    testEmotionRepository.save(emotion);
                } catch (NumberFormatException e) {
                    log.warn("빈도수(value)가 숫자가 아니므로 해당 라인을 건너뜁니다: '{}'", line[2]);
                }
            }
        }
    }
}
