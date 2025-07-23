package com.haeildiary.www.dashboard.wordcloud.service;

import com.haeildiary.www.dashboard.wordcloud.dto.TagCountDto;
import com.haeildiary.www.dashboard.wordcloud.dto.WordCloudDto;
import com.haeildiary.www.mood.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordCloudService {

    private final TagRepository tagRepository;

    public List<WordCloudDto> getWordCloudDataForUser(Integer userId) {

        // [수정]
        // 1. TagRepository에 추가한 쿼리 메소드를 호출하여 사용자별 태그 빈도수를 가져온다
        List<TagCountDto> tagCounts = tagRepository.countTagsByUserId(userId);

        // 2. [추가] 서비스 계층에서 상위 100개의 데이터만 선택
        // 이 과정을 통해 프론트엔드의 렌더링 부하를 줄이고, 오버플로우 오류를 근본적으로 방지
        List<TagCountDto> top80TagCounts = tagCounts.stream()
                .limit(80) // 보여줄 최대 단어 개수를 80개로 제한
                .collect(Collectors.toList());

        // 3. 조회된 TagCountDto 리스트를 프론트엔드로 전달할 WordCloudDto 리스트로 변환
        // - stream()과 map()을 사용하여 간결하게 변환 로직을 처리
        // - sentiment 정보는 현재 Tag 엔티티에 없으므로 우선 null로 설정
        return top80TagCounts.stream()
                .map(tagCount -> new WordCloudDto(
                        tagCount.getTagName(),
                        tagCount.getCount().intValue(), // Long 타입을 int 타입으로 변환
                        null // sentiment 필드는 현재 로직에 없으므로 null 처리
                ))
                .collect(Collectors.toList());

    }
}
