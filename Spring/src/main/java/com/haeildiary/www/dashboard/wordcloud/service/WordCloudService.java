package com.haeildiary.www.dashboard.wordcloud.service;

import com.haeildiary.www.dashboard.wordcloud.dto.WordCloudDto;
import com.haeildiary.www.dashboard.wordcloud.emotion.entity.TestMoodDetailEntity;
import com.haeildiary.www.dashboard.wordcloud.emotion.respository.TestEmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordCloudService {

    private final TestEmotionRepository testEmotionRepository;

    // --- 🚀 향후 단계: 실제 Repository 주입 (현재는 주석 처리) ---
    // private final WordCloudRepository wordCloudRepository;

    public List<WordCloudDto> getWordCloudDataForUser(Integer userId) {

        List<TestMoodDetailEntity> analysisResults = testEmotionRepository.findAll();

        // Entity 리스트를 DTO 리스트로 변환
        return analysisResults.stream()
                .map(detail -> new WordCloudDto(
                        detail.getKeyword(),
                        detail.getValue(),
                        detail.getSentiment()
                ))
                .collect(Collectors.toList());

        /*
        // ===================================================================
        // 🚀 향후 단계: 실제 DB 연동 로직 (현재는 주석 처리)
        // ===================================================================
        // 1. Repository를 통해 DB에서 데이터를 가져옵니다.
        List<TestMoodDetailEntity> analysisResults = wordCloudRepository.findTopKeywordsForUser(userId);

        // 2. Entity 리스트를 DTO 리스트로 변환합니다.
        return analysisResults.stream()
                .map(detail -> new WordCloudDto(
                        detail.getKeyword(),
                        (int) (detail.getPercentage() * 100),
                        detail.getSentiment()
                ))
                .collect(Collectors.toList());
        */
    }
}
