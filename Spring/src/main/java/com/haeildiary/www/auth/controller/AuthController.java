package com.haeildiary.www.auth.controller;

/**
 * 📂 AuthController.java
 * ────────────────────────────────
 * ✅ 역할:
 * - 사용자 인증 및 권한 관련 모든 요청 처리
 * - 로그인(JWT 토큰 발급 및 세션 관리), 회원가입, 로그아웃, 비밀번호 찾기/변경, 마이페이지 조회 등
 * - JWT 토큰과 세션 혼합 사용, Thymeleaf 기반 뷰 렌더링 지원
 *
 * 📊 데이터 흐름도
 * 1️⃣ 로그인 요청 → 인증 → JWT/Refresh Token 생성 → 쿠키 + 세션 저장 → 성공 응답
 * 2️⃣ 회원가입 요청 → 이메일 중복 확인 → 신규 사용자 저장 → 리다이렉트
 * 3️⃣ 로그아웃 요청 → Refresh Token 파기 → 쿠키 삭제 → 성공 응답
 * 4️⃣ 이메일 찾기 요청 → 전화번호 조회 → 마스킹된 이메일 반환
 * 5️⃣ 임시 비밀번호 발급 및 임시 비밀번호로 로그인
 * 6️⃣ 마이페이지 요청 → 인증 사용자 정보 조회 → 사용자 정보 뷰 반환
 * 7️⃣ 비밀번호 변경 → 인증 확인 → 비밀번호 변경 → 세션 및 토큰 삭제 → 성공 응답
 * 8️⃣ Access Token 재발급 → Refresh Token 검증 → 새 토큰 발급
 */

import com.haeildiary.www.auth.dto.ChangePWRequestDto;
import com.haeildiary.www.auth.dto.FindPWRequestDto;
import com.haeildiary.www.auth.dto.LoginRequestDto;
import com.haeildiary.www.auth.dto.RegisterRequestDto;
import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.service.*;
import com.haeildiary.www.auth.jwt.JwtProvider;
import com.haeildiary.www.auth.user.CustomUser;
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
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService; // 비즈니스 로직
    private final LogoutService logoutService; // 로그아웃 처리
    private final JwtProvider jwtProvider; // JWT 생성 /검증 .etc
    private final AuthenticationManager authenticationManager;

    // 1️⃣ 메인 페이지 - 세션에 사용자 있으면 모델에 전달 (Thymeleaf 뷰용)
    @GetMapping("/")
    public String index(Model model, HttpSession session) {

        if (session.getAttribute("user") != null) {
            model.addAttribute("user", session.getAttribute("user")); // 👤 세션 사용자 전달
        }
        return "index";
    }

    // 2️⃣ 로그인 처리 - JWT 토큰 발급 + 세션 저장
    @PostMapping("/login/jwt")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest, HttpSession session, HttpServletResponse response) {
        try {
            // 🔐 이메일, 비밀번호 인증 시도
            Authentication authentication = userService.loginAndAuthenticate(loginRequest.getEmail(), loginRequest.getPassword());

            // 🍪 인증 성공 시 JWT, Refresh Token 쿠키 및 세션에 사용자 정보 저장
            userService.processLoginSuccess(authentication, loginRequest.getEmail(), session, response);

            return ResponseEntity.ok(Map.of("success", true));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "탈퇴한 회원입니다."));
        } catch (AuthenticationException e) { // Catch general AuthenticationException
            // Check if the cause is DisabledException
            if (e.getCause() instanceof DisabledException) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "탈퇴한 회원입니다."));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인 실패"));
            }
        }
    }

    // 3️⃣ 로그인 필요 페이지 안내 뷰
    @GetMapping("/need-login")
    public String needLogin(Model model) {
        model.addAttribute("message", "로그인이 필요한 페이지입니다.");
        return "auth/need-login.html";
    }

    // 4️⃣ 로그아웃 - Refresh Token 파기 및 쿠키 삭제
    @PostMapping("/user/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue(); // 🍪 쿠키에서 refreshToken 추출
                    break;
                }
            }
        }

        if (refreshToken != null) {
            try {
                Claims claims = jwtProvider.extractToken(refreshToken); // 🧾 토큰 파싱
                String email = claims.getSubject();
                userService.logout(email); // 🧹 서버측 토큰 무효화 처리
            } catch (Exception e) {
                log.error("Refresh Token 파싱 실패", e);
            }
        }

        return ResponseEntity.ok().build();
    }

    // 5️⃣ 이메일 찾기 페이지 (뷰)
    @GetMapping("/find-email")
    public String findEmailPage() {
        return "auth/find-email.html";
    }

    // 6️⃣ 이메일 찾기 - 전화번호로 사용자 조회 후 이메일 마스킹 반환
    @PostMapping("/find-email/verify")
    public ResponseEntity<?> verifyPhone(@RequestBody Map<String, String> request) throws Exception {

        String phone = request.get("phone");

        EmailFindStatus emailFindStatus = userService.checkPhoneForEmailFind(phone);

        if (emailFindStatus == EmailFindStatus.NOT_FOUND) {
            Map<String, String> response = new HashMap<>();
            response.put("maskedEmail", null);
            return ResponseEntity.ok(response);
        } else if (emailFindStatus == EmailFindStatus.INACTIVE_USER_FOUND) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", emailFindStatus.getMessage()));
        } else { // ACTIVE_USER_FOUND
            // 🙈 이메일 마스킹 처리 (ex: abc***@domain.com)
            // 이메일은 userService.getUserByEmail(phone) 등으로 다시 조회해야 함.
            // 하지만 여기서는 이미 checkPhoneForEmailFind에서 userOptional을 사용했으므로,
            // userOptional을 다시 얻거나, EmailFindStatus에 user.email을 포함시키는 방법도 고려 가능.
            // 현재는 findUserByPhone을 다시 호출하여 user를 얻는 방식으로 진행.
            Optional<UserEntity> user = userService.findUserByPhone(phone);
            String maskedEmail = maskEmail(user.get().getEmail());
            return ResponseEntity.ok(Map.of("maskedEmail", maskedEmail));
        }
    }

    // 이메일 마스킹 로직
    private String maskEmail(String email) {
        int atIdx = email.indexOf('@');
        if (atIdx < 3) return "***" + email.substring(atIdx);
        return email.substring(0, 3) + "***" + email.substring(atIdx);
    }

    // 7️⃣ 비밀번호 찾기 페이지 (뷰)
    @GetMapping("/find-password")
    public String findPassword() {
        return "auth/find-password.html";
    }

    // 8️⃣ 임시 비밀번호 발급 요청 처리
    @PostMapping("/find-password/send")
    @ResponseBody
    public Map<String, Object> sendTempPassword(@RequestBody FindPWRequestDto dto) {
        Map<String, Object> result = new HashMap<>();
        try {
            userService.sendTempPassword(dto.getEmail()); // 📩 임시 비밀번호 메일 발송
            result.put("success", true);
        } catch (IllegalArgumentException e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    // 9️⃣ 임시 비밀번호로 로그인 처리
    @PostMapping("/find-password/login")
    @ResponseBody
    public ResponseEntity<?> loginWithTempPassword(@RequestBody LoginRequestDto dto, HttpSession session, HttpServletResponse response) {
        try {
            // 1. 인증 및 로그인 처리 (Service로 분리)
            Authentication authentication = userService.loginAndAuthenticate(dto.getEmail(), dto.getPassword());

            // 2. 로그인 성공 후 토큰/쿠키/세션 처리 (Service로 분리)
            userService.processLoginSuccess(authentication, dto.getEmail(), session, response);

            return ResponseEntity.ok(Map.of("success", true));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "임시 비밀번호가 일치하지 않습니다."));
        }
    }

    // 🔟 회원가입 페이지 (뷰)
    @GetMapping("/register")
    public String register(Model model) {
        return "auth/register.html";
    }

    // 1️⃣1️⃣ 회원가입 요청 처리
    @PostMapping("/register/newUser")
    public String newUser(@ModelAttribute @Valid RegisterRequestDto requestDto,
                          BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("errors", bindingResult.getAllErrors()); // ⚠️ 유효성 오류 처리
            return "auth/register.html";
        }
        // 이메일 상태 확인 (가입 가능, 활성/비활성 중복)
        EmailStatus emailStatus = userService.checkEmailStatus(requestDto.getEmail());
        if (emailStatus != EmailStatus.AVAILABLE) {
            model.addAttribute("emailError", emailStatus.getMessage());
            return "auth/register.html";
        }

        // 전화번호 상태 확인 (가입 가능, 활성/비활성 중복)
        PhoneStatus phoneStatus = null;
        try {
            phoneStatus = userService.checkPhoneStatus(requestDto.getPhone());
        } catch (Exception e) {
            log.error("전화번호 중복 체크 중 오류 발생", e);
            model.addAttribute("generalError", "전화번호 확인 중 오류가 발생했습니다.");
            return "auth/register.html";
        }

        if (phoneStatus != PhoneStatus.AVAILABLE) {
            model.addAttribute("phoneError", phoneStatus.getMessage());
            return "auth/register.html";
        }

        try {
            userService.addNewUser(requestDto); // 🆕 신규 사용자 저장
        } catch (IllegalArgumentException e) {
            log.error("회원가입 중 오류 발생: {}", e.getMessage());
            model.addAttribute("generalError", e.getMessage()); // 에러 메시지를 모델에 추가
            return "auth/register.html"; // 회원가입 페이지로 돌아감
        }
        return "redirect:/";
    }

    // 1️⃣2️⃣ Access Token 재발급 요청 처리
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh Token이 필요합니다."));
        }

        try {
            String newAccessToken = userService.reissueAccessToken(refreshToken); // 🔄 토큰 재발급
            return ResponseEntity.ok(newAccessToken);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // 1️⃣3️⃣ 마이페이지 - 인증된 사용자 정보 조회 후 뷰 반환
    @GetMapping("/my-page")
    public String myPage(Model model, @AuthenticationPrincipal CustomUser customUser) {
        if (customUser == null) {
            return "redirect:/"; // 로그인 안 되어 있으면 메인으로 리다이렉트
        }

        UserEntity user = userService.getUserByEmail(customUser.getUsername()); // 📨 DB에서 최신 사용자 정보 조회
        model.addAttribute("user", user);

        return "auth/my-page.html";
    }

    // 1️⃣4️⃣ 마이페이지 - 비밀번호 변경 처리
    @PostMapping("/my-page/change-password")
    @ResponseBody
    public Map<String, Object> changePassword(@RequestBody ChangePWRequestDto dto,
                                              @AuthenticationPrincipal CustomUser customUser,
                                              HttpServletRequest request, // request 파라미터 추가
                                              HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();

        if (customUser == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        try {
            userService.changePassword(customUser.getUsername(),
                    dto.getCurrentPassword(), dto.getNewPassword()); // 🔑 비밀번호 변경

            // 🧹 통합 로그아웃 처리
            logoutService.logout(request, response);

            result.put("success", true);
        } catch (IllegalArgumentException e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return result;
    }

    // 1️⃣5️⃣ 프로필 이미지 업데이트 API
    @PostMapping("/api/user/profile-image")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateProfileImage(
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal CustomUser customUser) {
        Map<String, Object> response = new HashMap<>();
        if (customUser == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            String profileImageKey = requestBody.get("profileImage");
            userService.updateProfileImage(customUser.getUserId(), profileImageKey);
            response.put("success", true);
            response.put("message", "프로필 이미지가 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("프로필 이미지 업데이트 실패", e);
            response.put("success", false);
            response.put("message", "프로필 이미지 업데이트에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 1️⃣6️⃣ 프로필 이미지 삭제 API
    @DeleteMapping("/api/user/profile-image")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteProfileImage(
            @AuthenticationPrincipal CustomUser customUser) {
        Map<String, Object> response = new HashMap<>();
        if (customUser == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            userService.deleteProfileImage(customUser.getUserId());
            response.put("success", true);
            response.put("message", "프로필 이미지가 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("프로필 이미지 삭제 실패", e);
            response.put("success", false);
            response.put("message", "프로필 이미지 삭제에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 1️⃣7️⃣ 회원 탈퇴 API
    @DeleteMapping("/api/user/withdraw")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> withdrawUser(
            @AuthenticationPrincipal CustomUser customUser,
            HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();
        if (customUser == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            userService.withdrawUser(customUser.getUserId()); // 회원 상태 INACTIVE로 변경
            logoutService.logout(request, response); // 강제 로그아웃 처리

            result.put("success", true);
            result.put("message", "회원 탈퇴가 성공적으로 처리되었습니다.");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("회원 탈퇴 실패", e);
            result.put("success", false);
            result.put("message", "회원 탈퇴 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}