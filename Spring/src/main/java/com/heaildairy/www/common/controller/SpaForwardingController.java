package com.heaildairy.www.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 🎮 SpaForwardingController.java
 * ──────────────────────────────
 * ✅ 역할:
 * - React와 같은 Single Page Application(SPA)의 클라이언트 사이드 라우팅을 지원합니다.
 * - 사용자가 브라우저에서 React Router가 관리하는 경로로 직접 접근하거나 새로고침했을 때,
 * 서버가 404 오류를 반환하는 대신 React 앱의 진입점(index.html)을 로드할 수 있도록 포워딩합니다.
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트가 UI 경로 요청 (e.g., /diary/view/123)
 * 2️⃣ DispatcherServlet이 이 Controller의 @GetMapping 패턴과 매칭
 * 3️⃣ forwardToIndex() 메소드가 "forward:/" 문자열 반환
 * 4️⃣ 서버 내부에서 "/" 경로를 처리하는 다른 컨트롤러(e.g., AuthController)로 요청이 전달됨
 * 5️⃣ 최종적으로 index.html 뷰가 렌더링되어 클라이언트에게 반환됨
 */
@Controller
public class SpaForwardingController {

    /**
     * 🛠️ React의 모든 최상위 경로를 여기에 등록합니다.
     * - 이 경로들로 GET 요청이 오면, 서버 내부적으로 루트("/") 경로로 포워딩합니다.
     */
    @GetMapping({
            "/main",
            "/diary/**",
            "/write/**",
            "/view/**",
            "/chart/**",
            "/explore/**",
            "/settings/**"
            // 💡 나중에 새로운 기능(페이지)이 추가되면 여기에 경로 패턴을 추가해야 합니다.
    })
    public String forwardToSpa() {
        // "forward:/"는 실제 URL 변경 없이 서버 내부에서 "/" 엔드포인트로 요청을 다시 보냅니다.
        // 이를 통해 React 앱의 메인 진입점(index.html)을 제공하는 컨트롤러가 응답하게 됩니다.
        return "forward:/";
    }
}
