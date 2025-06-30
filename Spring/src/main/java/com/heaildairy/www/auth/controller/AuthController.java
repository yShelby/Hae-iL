package com.heaildairy.www.auth.controller;

import com.heaildairy.www.auth.dto.LoginRequestDto;
import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.jwt.JwtProvider;
import com.heaildairy.www.auth.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService; // 비즈니스 로직
    private final JwtProvider jwtProvider; // JWT 생성 /검증 .etc
    private final AuthenticationManager authenticationManager;

    // 메인 페이지 (Thymeleaf로 세션 정보 전달)
    @GetMapping("/")
    public String index(Model model, HttpSession session) {

        if (session.getAttribute("user") != null) {
            model.addAttribute("user", session.getAttribute("user"));
        }
        return "index.html"; // index.html 반환

    }

    // 로그인 처리 (세션에 사용자 정보 저장)
    @PostMapping("/login/jwt")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest, HttpSession session, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            // UserService를 통해 사용자 정보 조회
            UserEntity user = userService.getUserByEmail(loginRequest.getEmail());
            session.setAttribute("user", user);

            // Access Token & Refresh Token 발급
            String accessToken = jwtProvider.createAccessToken(authentication);
            String refreshToken = jwtProvider.createRefreshToken(authentication);
            // Refresh Token DB 저장
            userService.saveOrUpdateRefreshToken(loginRequest.getEmail(), refreshToken);

            // Access Token 쿠키에 저장
            Cookie accessCookie = new Cookie("jwt", accessToken);
            accessCookie.setHttpOnly(true);
            accessCookie.setSecure(true);
            accessCookie.setMaxAge(60 * 5); // 5분
            accessCookie.setPath("/");
            response.addCookie(accessCookie);

            // Refresh Token 쿠키에 저장
            Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(true);
            refreshCookie.setMaxAge(60 * 60 * 24 * 7); // 7일
            refreshCookie.setPath("/");
            response.addCookie(refreshCookie);

            // 프론트에서 쿠키를 사용한다면 간단한 응답 반환
            return ResponseEntity.ok(Map.of("success", true));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인 실패"));
        }
    }

    // 로그아웃 페이지
    @PostMapping("/user/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Refresh Token 쿠키에서 추출
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // Refresh Token DB에서 삭제
        if (refreshToken != null) {
            try {
                Claims claims = jwtProvider.extractToken(refreshToken);
                String email = claims.getSubject();
                userService.logout(email);
            } catch (Exception e) {
                    log.error("Refresh Token 파싱 실패", e);
            }
        }

        return ResponseEntity.ok().build();
    }


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
    public String myPage(Model model, HttpSession session) {

        UserEntity user = (UserEntity) session.getAttribute("user");
        model.addAttribute("user", user);

        return "/auth/my-page.html";
    }

}