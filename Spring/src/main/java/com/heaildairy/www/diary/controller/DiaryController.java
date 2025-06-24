package com.heaildairy.www.diary.controller;

import com.heaildairy.www.diary.dto.DiaryDTO;
import com.heaildairy.www.diary.service.DiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // accessing different ports(5173 vs 8080)
public class DiaryController {

    private final DiaryService diaryService; //Declares OrderService field

    @PostMapping("/auth") // api 생성 시 주소 참조(뒤에 /로 더 넣어도 괜찮음)
    public ResponseEntity<String> save(@Valid @RequestBody DiaryDTO dto){
        diaryService.save(dto);
        return ResponseEntity.ok("Diary");
    }
}
