package com.heaildairy.www.journal.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.dashboard.todolist.service.TodoListService;
import com.heaildairy.www.journal.dto.JournalRequestDto;
import com.heaildairy.www.journal.dto.JournalResponseDto;
import com.heaildairy.www.journal.entity.Category;
import com.heaildairy.www.journal.entity.JournalEntity;
import com.heaildairy.www.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;
    private final TodoListService todoListService; // TodoListService 의존성 주입


    public Long createJournal(Integer userId, JournalRequestDto requestDto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 사용자를 찾을 수 없습니다. ID: "+ userId));

        JournalEntity journal = new JournalEntity(user, requestDto);
        JournalEntity savedJournal = journalRepository.save(journal);

        // 추가
        try {
            todoListService.markAsCompleted(userId, "journaling");
        } catch (Exception e) {
            // 미션 상태 업데이트가 실패해도 저널 저장은 롤백되지 않도록 예외 처리
            System.err.println("Journal 생성 후 TodoList 업데이트 실패: " + e.getMessage());
        }

        return savedJournal.getJournalId();
    }

    @Transactional(readOnly = true)
    public List<JournalResponseDto> getJournals(Integer userId, String categoryStr) {
        if ("all".equalsIgnoreCase(categoryStr)) {
            return journalRepository.findAllJournals(userId)
                    .stream()
                    .map(JournalResponseDto::new)
                    .collect(Collectors.toList());
        } else {
            // 문자열 카테고리를 대문자로 변환하여 Enum과 매칭
            try {
                Category category = Category.valueOf(categoryStr.toUpperCase());
                return journalRepository.findJournalsByCategory(userId, category)
                        .stream()
                        .map(JournalResponseDto::new )
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // 유효하지 않은 카테고리 문자열이 들어올 경우 빈 리스트 반환 또는 예외 처리
                return List.of();
            }
        }
    }

    public void updateJournal(Integer userId, Long journalId, JournalRequestDto requestDto) {
        JournalEntity journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new EntityNotFoundException("해당 저널을 찾을 수 없습니다. ID: " + journalId));

        // 보안 - 현재 로그인한 사용자가 해당 저널의 작성자인지 확인
        if (!journal.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("이 저널을 수정할 권한이 없습니다.");
        }

        journal.update(requestDto); // 엔티티 내부의 update 메소드 호출
    }

    public void deleteJournal(Integer userId, Long journalId) {
        JournalEntity journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new EntityNotFoundException("해당 저널을 찾을 수 없습니다. ID: " + journalId));

        // 보안 - 현재 로그인한 사용자가 해당 저널의 작성자인지 확인
        if (!journal.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("이 저널을 삭제할 권한이 없습니다.");
        }

        LocalDate journalDate = journal.getJournalDate(); // ✅ 삭제 전에 날짜 정보 저장
        journalRepository.delete(journal);

        // 추가
        try {
            if (journalDate != null && journalDate.isEqual(LocalDate.now())) {
                todoListService.markAsIncomplete(userId, "journaling");
            }
        } catch (Exception e) {
            System.err.println("저널 삭제 후 TodoList 업데이트 실패: " + e.getMessage());
        }
    }

    // ID로 특정 저널을 조회하는 메소드
    @Transactional(readOnly = true)
    public JournalResponseDto getJournalById(Integer userId, Long journalId) {
        JournalEntity journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new EntityNotFoundException("해당 저널을 찾을 수 없습니다. ID: " + journalId));

        // [보안] 현재 로그인한 사용자가 해당 저널의 작성자인지 확인
        if (!journal.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("이 저널을 조회할 권한이 없습니다.");
        }

        return new JournalResponseDto(journal);
    }
}
