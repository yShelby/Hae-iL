package com.heaildairy.www.timeline.service;


import com.heaildairy.www.timeline.dto.TimelineDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class TimelineService {
    //이후에 diary, emotion repository 등을 호출하면 됨 (재사용)
}
