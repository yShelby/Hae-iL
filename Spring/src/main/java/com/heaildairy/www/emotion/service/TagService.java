package com.heaildairy.www.emotion.service;

import com.heaildairy.www.emotion.dto.TagDTO;
import com.heaildairy.www.emotion.entity.Tag;
import com.heaildairy.www.emotion.repository.TagRepository;
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