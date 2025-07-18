package com.haeildiary.www.dashboard.wordcloud.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.dashboard.wordcloud.dto.WordCloudDto;
import com.haeildiary.www.dashboard.wordcloud.service.WordCloudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/dashboard/wordcloud")
@RequiredArgsConstructor
public class WordCloudController {

    private final WordCloudService wordCloudService;

    @GetMapping
    public ResponseEntity<List<WordCloudDto>> getWordCloudData(@AuthenticationPrincipal CustomUser customUser) {

        // CustomUser 객체에서 실제 사용자 ID 추출
        if (customUser == null) {
            // 사용자가 인증되지 않은 경우, 401 Unauthorized 에러를 반환합니다.
            // (보통 Spring Security 필터 체인에서 먼저 처리되지만, 방어 코드로 남겨둡니다.)
            return ResponseEntity.status(401).build();
        }

        Integer userId = customUser.getUserId();

        List<WordCloudDto> wordCloudData = wordCloudService.getWordCloudDataForUser(userId);

        // 조회된 데이터를 성공(200 OK) 상태 코드와 함께 응답
        return ResponseEntity.ok(wordCloudData);
    }
}
