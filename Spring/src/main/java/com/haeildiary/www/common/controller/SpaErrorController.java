// 📂 File: com.heaildairy.www.common.controller.SpaErrorController.java
// 📌 역할: SPA (Single Page Application) 환경에서 서버 사이드 404 에러 발생 시,
//         클라이언트 라우팅을 유지하기 위해 index.html로 포워딩 처리
//         → React, Vue 등에서 새로고침하면 404 에러 나는 것 방지 목적
// 📊 데이터 흐름도:
//   📍 1. 클라이언트에서 존재하지 않는 경로 요청 (e.g., /diary/123)
//   📍 2. Spring Boot가 해당 요청을 처리할 Controller를 찾지 못함 → 자동으로 "/error"로 포워딩
//   📍 3. SpaErrorController의 handleError 메서드 실행됨
//   📍 4. 상태 코드가 404면 index.html로 렌더링 (SPA 라우팅 유지)
//   📍 5. 그 외 상태는 error.html 등 기본 에러 페이지로 이동

<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/common/controller/SpaErrorController.java
package com.haeildiary.www.common.controller;
========
package com.haeildairy.www.common.controller;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/common/controller/SpaErrorController.java

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaErrorController implements ErrorController {

    // 🛠️ Logger 설정 - 에러 발생 시 로그 출력
    private static final Logger log = LoggerFactory.getLogger(SpaErrorController.class);

    // ⚠️ 모든 에러 요청("/error")을 이 메서드가 처리
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        // 📥 1. 에러 상태 코드 가져오기 (e.g., 404, 500)
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        // 📍 요청된 URI 정보 (원래 어디로 접근했는지)
        String originalUri = (String) request.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);

        // 📝 요청 URI 로그 출력
        log.info("SpaErrorController triggered for URI: {}", originalUri != null ? originalUri : request.getRequestURI());

        // ✅ 상태 코드가 존재할 경우 처리
        if (status != null) {
            // 🧮 상태 코드를 int로 파싱
            int statusCode = Integer.parseInt(status.toString());

            // 📋 상태 코드 로그 출력
            log.info("Error detected with status code: {}", statusCode);

            // 🔍 404 에러일 경우 → SPA 라우팅 처리 (index.html로 이동)
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                log.info("404 Not Found detected. Forwarding to /index.html...");
                return "index";  // 🌐 index.html 렌더링 (Thymeleaf 기반이면 templates/index.html)
            }
        }

        // ❗ 그 외 다른 에러 → 기본 에러 페이지 렌더링
        log.error("Unhandled error with status: {}. Returning default error page.", status);
        return "error"; // 🚨 error.html 렌더링 (templates/error.html)
    }
}
