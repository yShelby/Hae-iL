package com.heaildairy.www.timeline.controller;

import com.heaildairy.www.timeline.dto.TimelineDTO;
import com.heaildairy.www.timeline.service.TimelineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // accessing different ports(5173 vs 8080)
public class TimelineController {

    private final TimelineService timelineService; //Declares OrderService field

    @GetMapping("/timeline") // api 생성 시 주소 참조(뒤에 /로 더 넣어도 괜찮음)
    public ResponseEntity<String> getTimeline(){
        return ResponseEntity.ok("Timeline");
    }
}
