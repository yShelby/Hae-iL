package com.heaildairy.www.diary.service;


import com.heaildairy.www.diary.dto.DiaryDTO;
import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public void save(DiaryDTO dto){
        DiaryEntity order = new DiaryEntity(dto.menu(), dto.count());
        diaryRepository.save(order);
    }

}
