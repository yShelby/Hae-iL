package com.heaildairy.www.journal.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.journal.dto.JournalRequestDto;
import com.heaildairy.www.journal.dto.JournalResponseDto;
import com.heaildairy.www.journal.entity.Category;
import com.heaildairy.www.journal.entity.JournalEntity;
import com.heaildairy.www.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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

    public Long saveJournal(Integer userId, JournalRequestDto requestDto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 사용자를 찾을 수 없습니다. ID: "+ userId));

        JournalEntity journal = new JournalEntity(user, requestDto);

        JournalEntity savedJournal = journalRepository.save(journal);

        return savedJournal.getId();
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
}
