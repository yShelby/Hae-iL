//package com.heaildairy.www.emotion.service;

//
//import com.heaildairy.www.emotion.dto.EmotionDTO;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class EmotionService {
//
//    private final EmotionRepository orderRepository;
//
//    public void save(EmotionDTO dto){
//        EmotionEntity order = new EmotionEntity(dto.menu(), dto.count());
//        orderRepository.save(order);
//    }
//
//}
