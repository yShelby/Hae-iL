package com.heaildairy.www.auth.controller;

import com.heaildairy.www.auth.dto.LoginRequestDto;
import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.jwt.JwtProvider;
import com.heaildairy.www.auth.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService; // 비즈니스 로직
    // private final MyUserDetailService myUserDetailService; // 필요에 따라 직접 사용 가능하나, AuthService를 통하는 것이 일반적
    private final JwtProvider jwtProvider; // JWT 생성 /검증 .etc
    private final AuthenticationManager authenticationManager;

    // 메인 메이지
    @GetMapping("/")
    String index(){ return "index.html";}

    // 회원가입 폼 페이지
    @GetMapping("/register")
    String register(Model model) {

        return "auth/register.html";
    }

    // 회원가입 - 회원 저장 페이지 (유효성 검사 활성화)
    @PostMapping("/register/newUser")
    String newUser(@ModelAttribute @Valid RegisterRequestDto requestDto, BindingResult bindingResult, Model model) {

        // @Valid 어노테이션에 의한 DTO 유효성 검사 오류 처리
        if (bindingResult.hasErrors()) {
            System.out.println("DTO 유효성 검사 오류 발생:");
            bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
            model.addAttribute("errors", bindingResult.getAllErrors());
            return "auth/register.html";
        }

//        System.out.println("Display email (DTO): " + requestDto.getEmail());
//        System.out.println("Username Nickname (DTO): " + requestDto.getNickname());
//        System.out.println("Password Password (DTO): " + requestDto.getPassword());

        userService.addNewUser(requestDto);

        return "redirect:/";
    }

    // 로그인 페이지
    @GetMapping("login")
    String login(){
        return "auth/login.html";
    }

    // 로그인 - 아이디/비번 검증 & 토큰 생성 페이지
    @PostMapping("/login/jwt")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
//        String token = jwtProvider.createAccessToken(authentication);
//        // 쿠키에 저장
//        Cookie cookie = new Cookie("jwt", token);
//        cookie.setHttpOnly(true);
//        cookie.setMaxAge(60 * 5); // 5분
//        cookie.setPath("/");
//        response.addCookie(cookie);
//
//        return ResponseEntity.ok().body(token);

        // Access Token 발급
        String accessToken = jwtProvider.createAccessToken(authentication);
        // Refresh Token 발급
        String refreshToken = jwtProvider.createRefreshToken(authentication);

        // Refresh Token DB 저장
        userService.saveOrUpdateRefreshToken(loginRequest.getEmail(), refreshToken);

        // Access Token 쿠키에 저장 (또는 응답 바디로 반환)
        Cookie accessCookie = new Cookie("jwt", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setMaxAge(60 * 5); // 5분
        accessCookie.setPath("/");
        response.addCookie(accessCookie);

        // Refresh Token 쿠키에 저장 (또는 응답 바디로 반환)
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setMaxAge(60 * 60 * 24 * 7); // 7일
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);

        // 응답 바디로도 토큰을 반환할 수 있음
        // return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken));
        return ResponseEntity.ok(accessToken);
    }

    // RefreshToken 재발급 페이지
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body("Refresh Token이 필요합니다.");
        }
        try {
            String newAccessToken = userService.reissueAccessToken(refreshToken);
            return ResponseEntity.ok(newAccessToken);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/my-page")
    public String myPage(Model model, Authentication authentication) {


        model.addAttribute("userInfo", authentication);

        return "/auth/my-page.html";
    }

}