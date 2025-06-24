package com.heaildairy.www.emotion.controller;

import com.heaildairy.www.emotion.dto.EmotionDTO;
import com.heaildairy.www.emotion.service.EmotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // accessing different ports(5173 vs 8080)
public class EmotionController {

    private final EmotionService emotionService; //Declares OrderService field

    @PostMapping("/emotion") // api 생성 시 주소 참조(뒤에 /로 더 넣어도 괜찮음)
    public ResponseEntity<String> save(@Valid @RequestBody EmotionDTO dto){
        emotionService.save(dto);
        return ResponseEntity.ok("Emotion");
    }
}
