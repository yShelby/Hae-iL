package com.heaildairy.www.auth.controller;

import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService; // 비즈니스 로직
//    private final JwtUtil jwtUtil; // JWT 생성/검증 유틸
    // private final MyUserDetailService myUserDetailService; // 필요에 따라 직접 사용 가능하나, AuthService를 통하는 것이 일반적

    @GetMapping("/")
    String index(){ return "index.html";}

    @GetMapping("/register")
    String register(Model model) {

        return "auth/register.html";
    }

    @PostMapping("/register/newUser")
    String newUser(@ModelAttribute RegisterRequestDto requestDto) {

        System.out.println("Display email (DTO): " + requestDto.getEmail());
        System.out.println("Username Nickname (DTO): " + requestDto.getNickname());
        System.out.println("Password Password (DTO): " + requestDto.getPassword());

        userService.addNewUser(requestDto);

        return "redirect:/";
    }

//    @PostMapping("/login") // 일반 로그인 (필요시)
//    public ResponseEntity<String> login(@RequestBody LoginRequestDto requestDto, HttpServletResponse response) {
//        // AuthService에서 인증 및 JWT 발급 처리 후 반환받음
//        String jwt = authService.login(requestDto);
//
//        Cookie cookie = new Cookie("jwt", jwt);
//        cookie.setMaxAge(300); // 5분
//        cookie.setHttpOnly(true);
//        cookie.setPath("/");
//        response.addCookie(cookie);
//
//        return ResponseEntity.ok("로그인 성공");
//    }
//
//    @GetMapping("/my-page") // 인증된 사용자만 접근 (HTML 뷰 반환)
//    public String myPage(Authentication auth, org.springframework.ui.Model model) {
//        // CustomUser user = (CustomUser) auth.getPrincipal(); // CustomUser 타입 캐스팅
//        UserInfoResponseDto userInfo = authService.getUserInfo(auth); // AuthService에서 DTO 변환
//        model.addAttribute("userInfo", userInfo);
//        return "my-page"; // my-page.html 템플릿 반환
//    }
//
//    @GetMapping("/user-info") // 인증된 사용자 정보 API (JSON 반환)
//    public ResponseEntity<UserInfoResponseDto> getUserInfo(Authentication auth) {
//        // CustomUser user = (CustomUser) auth.getPrincipal();
//        UserInfoResponseDto userInfo = authService.getUserInfo(auth);
//        return ResponseEntity.ok(userInfo);
//    }
//
//    @PostMapping("/logout") // POST 요청으로 변경 권장
//    public ResponseEntity<String> logout(HttpServletResponse response) {
//        Cookie cookie = new Cookie("jwt", null); // 쿠키 삭제
//        cookie.setMaxAge(0);
//        cookie.setHttpOnly(true);
//        cookie.setPath("/");
//        response.addCookie(cookie);
//        return ResponseEntity.ok("로그아웃 되었습니다.");
//    }
}