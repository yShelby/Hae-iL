package com.heaildairy.www.auth.controller;

import com.heaildairy.www.auth.entity.TestEntity;
import com.heaildairy.www.auth.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@ResponseBody
@RequiredArgsConstructor
public class TestController {

    private final TestRepository testRepository;

    @GetMapping("/test1")
    @ResponseBody
    public TestEntity test1(){

        TestEntity test1 = new TestEntity();

        test1.setTestName("테스트 완료");
        test1.setTestNum(6251342);

        testRepository.save(test1);

        return test1;
    }

}

