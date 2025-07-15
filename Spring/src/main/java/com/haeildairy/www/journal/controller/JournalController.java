package com.haeildairy.www.journal.controller;

import com.haeildairy.www.auth.user.CustomUser;
import com.haeildairy.www.journal.dto.JournalRequestDto;
import com.haeildairy.www.journal.dto.JournalResponseDto;
import com.haeildairy.www.journal.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<?> createJournal(
            @AuthenticationPrincipal CustomUser customUser,
            @Valid @RequestBody JournalRequestDto requestDto) {

        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer userId = customUser.getUserId();

        journalService.createJournal(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 특정 저널의 상세 정보를 조회하는 API
    @GetMapping("/{journalId}")
    public ResponseEntity<JournalResponseDto> getJournalById(
            @AuthenticationPrincipal CustomUser customUser,
            @PathVariable Long journalId) {

        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        JournalResponseDto journal = journalService.getJournalById(customUser.getUserId(), journalId);
        return ResponseEntity.ok(journal);
    }

    // 특정 저널을 수정하는 API
    @PutMapping("/{journalId}")
    public ResponseEntity<Void> updateJournal(
            @AuthenticationPrincipal CustomUser customUser,
            @PathVariable Long journalId,
            @Valid @RequestBody JournalRequestDto requestDto) {

        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        journalService.updateJournal(customUser.getUserId(), journalId, requestDto);
        return ResponseEntity.ok().build();
    }

    // 특정 저널을 삭제하는 API
    @DeleteMapping("/{journalId}")
    public ResponseEntity<Void> deleteJournal(
            @AuthenticationPrincipal CustomUser customUser,
            @PathVariable Long journalId) {

        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        journalService.deleteJournal(customUser.getUserId(), journalId);
        return ResponseEntity.noContent().build();
    }
}
