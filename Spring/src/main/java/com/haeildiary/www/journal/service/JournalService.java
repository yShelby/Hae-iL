package com.haeildiary.www.journal.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.journal.dto.JournalRequestDto;
import com.haeildiary.www.journal.dto.JournalResponseDto;
import com.haeildiary.www.journal.entity.Category;
import com.haeildiary.www.journal.entity.JournalEntity;
import com.haeildiary.www.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;

    public Long createJournal(Integer userId, JournalRequestDto requestDto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 사용자를 찾을 수 없습니다. ID: "+ userId));

        JournalEntity journal = new JournalEntity(user, requestDto);

        JournalEntity savedJournal = journalRepository.save(journal);

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

        journalRepository.delete(journal);
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
