package com.haeildiary.www.dashboard.wordcloud.emotion.controller;

import com.haeildiary.www.dashboard.wordcloud.emotion.entity.TestMoodDetailEntity;
import com.haeildiary.www.dashboard.wordcloud.emotion.respository.TestEmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/test-emotions")
@RequiredArgsConstructor
public class TestEmotionController {

    private final TestEmotionRepository testEmotionRepository;

    @GetMapping
    public ResponseEntity<List<TestMoodDetailEntity>> getAllEmotions() {
        // DB에 저장된 모든 감정 데이터를 조회하여 반환
        List<TestMoodDetailEntity> emotions = testEmotionRepository.findAll();
        return ResponseEntity.ok(emotions);
    }
}
