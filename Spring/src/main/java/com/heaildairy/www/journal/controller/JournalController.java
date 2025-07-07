package com.heaildairy.www.journal.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.journal.dto.JournalResponseDto;
import com.heaildairy.www.journal.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/journal")
public class JournalController {

    private final JournalService journalService;

    @GetMapping
    public ResponseEntity<List<JournalResponseDto>> getJouranlList(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam(defaultValue = "all") String category) {

        // 인증된 사용자인지 확인하는 방어 로직
        if (customUser == null) {
            // 인증되지 않은 사용자의 요청에 대해 401 Unauthorized 응답 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer currentUserId = customUser.getUserId();

        List<JournalResponseDto> journals = journalService.getJournals(currentUserId, category);
        return ResponseEntity.ok(journals);
    }
}
