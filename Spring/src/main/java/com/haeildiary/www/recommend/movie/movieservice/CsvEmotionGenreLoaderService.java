package com.haeildiary.www.recommend.movie.movieservice;


import com.haeildiary.www.recommend.movie.movieentity.EmotionGenreMapEntity;
import com.haeildiary.www.recommend.movie.movierepository.EmotionGenreMapRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CsvEmotionGenreLoaderService implements CommandLineRunner {

    private final EmotionGenreMapRepository emotionGenreMapRepository;

    @Override
    public void run(String... args) throws Exception {
        List<EmotionGenreMapEntity> dataList = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(
                new ClassPathResource("emotion_genre_map.csv").getInputStream(), "UTF-8"))) {

            String[] line;
            reader.readNext(); // 헤더 스킵

            while ((line = reader.readNext()) != null) {
                EmotionGenreMapEntity entity = new EmotionGenreMapEntity();
                entity.setMoodType(line[0]);
                entity.setGenreCode(Integer.parseInt(line[2]));
                entity.setGenreName(line[1]);
                entity.setGenreWeight(Double.parseDouble(line[3]));

                dataList.add(entity);
            }

            emotionGenreMapRepository.saveAll(dataList);
            log.info("CSV에서 총 {}개의 감정-장르 데이터를 저장했습니다.", dataList.size());
        }
    }
}
