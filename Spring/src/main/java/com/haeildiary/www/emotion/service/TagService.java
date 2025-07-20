<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/service/TagService.java
package com.haeildiary.www.emotion.service;

import com.haeildiary.www.emotion.dto.TagDTO;
import com.haeildiary.www.emotion.entity.Tag;
import com.haeildiary.www.emotion.repository.TagRepository;
========
package com.haeildairy.www.emotion.service;

import com.haeildairy.www.emotion.dto.TagDTO;
import com.haeildairy.www.emotion.entity.Tag;
import com.haeildairy.www.emotion.repository.TagRepository;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/service/TagService.java
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    // 태그 저장소
    private final TagRepository tagRepository;

    public Tag saveTag(TagDTO tagDTO) {
        Tag tag = tagRepository.findByTagName(tagDTO.getTagName()).orElse(null);

        if (tag != null){
            tag.setUsedCount(tag.getUsedCount()+1);
        } else {
            tag = new Tag();
        tag.setTagName(tagDTO.getTagName());
        tag.setUsedCount(1);
        }

        return tagRepository.save(tag);
    }

    public List<Tag> saveTag(List<TagDTO> tagDTOList) {
        List<Tag> savedTags = new ArrayList<>();
        for (TagDTO dto : tagDTOList) {
            savedTags.add(saveTag(dto)); // 단건 저장 메서드 호출
        }
        return savedTags;
    }

}