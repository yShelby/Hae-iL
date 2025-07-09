package com.heaildairy.www.auth.service;

import com.heaildairy.www.auth.config.AESUtil;
import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.entity.RefreshToken;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.jwt.JwtProvider;
import com.heaildairy.www.auth.repository.RefreshTokenRepository;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.auth.user.UserStatus;
import com.heaildairy.www.s3.service.S3Service; // S3Service 임포트 추가
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // <-- 이 줄 추가
import java.util.Optional;
import java.util.Random;

/**
 * 📂 UserService.java
 * ────────────────────────────────
 * ✅ 역할:
 * - 회원 가입, 로그인, 로그아웃, 비밀번호 변경 등 사용자 관련 핵심 비즈니스 로직 처리
 * - JWT 토큰 생성 및 Refresh Token DB 저장/갱신 관리
 * - 암호화된 전화번호 처리 및 임시 비밀번호 생성/이메일 발송 지원
 *
 * 📊 데이터 흐름도
 * 1️⃣ 회원가입 시 전화번호 암호화 → 사용자 정보 DB 저장
 * 2️⃣ 로그인 시 인증 매니저 통해 인증 → 토큰 발급 → 세션 및 쿠키 저장 → Refresh Token DB 저장/갱신
 * 3️⃣ Access Token 재발급 시 Refresh Token 검증 → DB 확인 → 새로운 Access & Refresh Token 발급 및 DB 갱신
 * 4️⃣ 전화번호 암/복호화 처리, 이메일 중복 확인, 사용자 조회 등 보조 기능 수행
 * 5️⃣ 비밀번호 찾기: 임시 비밀번호 생성 → 암호화 저장 → 이메일 발송
 * 6️⃣ 비밀번호 변경 시 기존 비밀번호 검증 후 새 비밀번호 저장
 * 7️⃣ 로그아웃 시 Refresh Token DB 삭제
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final S3Service s3Service;
    private final HttpSession session; // HttpSession 주입 추가 // S3Service 주입 추가


    // 1️⃣ 회원가입: 전화번호 암호화 후 사용자 정보 저장
    @Transactional
    public void addNewUser(RegisterRequestDto requestDto) {

        String encryptedPhone = null;
        try {
            encryptedPhone = AESUtil.encrypt(requestDto.getPhone()); // 전화번호 암호화
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        UserEntity newUser = new UserEntity();
        String hashPassword = passwordEncoder.encode(requestDto.getPassword()); // 비밀번호 암호화

        newUser.setEmail(requestDto.getEmail());
        newUser.setPassword(hashPassword);
        newUser.setName(requestDto.getName());
        newUser.setEncryptedPhoneNumber(encryptedPhone);
        newUser.setNickname(requestDto.getNickname());
        // newUser.setProfileImage(requestDto.getProfileImage()); // 임시 경로이므로 여기서 바로 저장하지 않음

        // 1. 사용자 정보 먼저 저장하여 userId 획득
        UserEntity savedUser = userRepository.save(newUser); // DB 저장

        // 2. 프로필 이미지 처리 (S3 임시 경로 -> 실제 userId 경로로 이동)
        String tempProfileImagePath = requestDto.getProfileImage(); // 프론트에서 넘어온 임시 S3 객체 키
        if (tempProfileImagePath != null && !tempProfileImagePath.isEmpty()) {
            // 임시 경로에서 실제 사용자 ID 경로로 변경
            // 예: profile_images/temp_uuid/profile.ext -> profile_images/{userId}/profile.ext
            String fileExtension = "";
            int dotIndex = tempProfileImagePath.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < tempProfileImagePath.length() - 1) {
                fileExtension = tempProfileImagePath.substring(dotIndex); // 확장자 추출
            }
            String permanentProfileImagePath = "profile_images/" + savedUser.getUserId() + "/profile" + fileExtension;

            // S3에서 객체 이동 (복사 후 원본 삭제)
            boolean moved = s3Service.moveS3Object(tempProfileImagePath, permanentProfileImagePath);

            if (moved) {
                savedUser.setProfileImage(permanentProfileImagePath); // UserEntity에 영구 경로 저장
                userRepository.save(savedUser); // 업데이트된 UserEntity 다시 저장
            } else {
                log.error("Failed to move profile image from {} to {}", tempProfileImagePath, permanentProfileImagePath);
                // 이미지 이동 실패 시 예외 처리 또는 기본 이미지 설정 등 추가 로직 필요
            }
        }
    }

    // 2️⃣ 로그인: Spring Security AuthenticationManager 통해 인증 처리
    @Transactional
    public Authentication loginAndAuthenticate(String email, String password)
            throws AuthenticationException {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        return authentication;
    }

    // 3️⃣ 로그인 성공 후 JWT 토큰 발급, 세션 저장, Refresh Token DB 저장 및 쿠키 세팅
    @Transactional
    public void processLoginSuccess(Authentication authentication, String email,
                                    HttpSession session, HttpServletResponse response) {

        // 사용자 정보 조회 후 세션에 저장
        UserEntity user = getUserByEmail(email);
        session.setAttribute("user", user);

        // lastLoginAt 업데이트
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // JWT Access Token, Refresh Token 생성
        String accessToken = jwtProvider.createAccessToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(authentication);

        // [리팩토링] email 대신 UserEntity 객체를 전달하여 Refresh Token 저장/갱신
        saveOrUpdateRefreshToken(user, refreshToken);

        // 쿠키 설정 (HttpOnly, Secure, Path, 만료시간)
        Cookie accessCookie = new Cookie("jwt", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setMaxAge(60 * 5); // 5분
        accessCookie.setPath("/");
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setMaxAge(60 * 60 * 24 * 7); // 7일
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
    }

    // 4️⃣ Access Token 재발급: Refresh Token 검증 → DB 확인 → 새 토큰 발급 및 DB 갱신
    @Transactional // [리팩토링] 데이터 조회와 수정을 함께 하므로 트랜잭션 처리 추가
    public String reissueAccessToken(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }

        Claims claims = jwtProvider.extractToken(refreshToken);
        String email = claims.getSubject();
        // [리팩토링] email로 UserEntity를 먼저 조회
        UserEntity user = getUserByEmail(email);

        // [리팩토링] UserEntity 객체로 DB에 저장된 토큰을 조회
        RefreshToken storedToken = refreshTokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Refresh Token입니다."));

        if (!storedToken.getRefreshToken().equals(refreshToken)) {
            throw new RuntimeException("Refresh Token이 일치하지 않습니다.");
        }

        Authentication authentication = jwtProvider.getAuthentication(refreshToken);
        String newAccessToken = jwtProvider.createAccessToken(authentication);
        String newRefreshToken = jwtProvider.createRefreshToken(authentication);

        // [리팩토링] 토큰을 삭제하고 새로 만드는 대신, 기존 토큰의 값을 변경하여 효율성 증대 (Dirty Checking)
        storedToken.setRefreshToken(newRefreshToken);
        refreshTokenRepository.save(storedToken);

        return newAccessToken;
    }

    // 5️⃣ Refresh Token DB 저장 혹은 갱신
    @Transactional
    // [리팩토링] email 대신 UserEntity 객체를 받도록 수정하여 타입 안정성 및 명확성 증대
    public void saveOrUpdateRefreshToken(UserEntity user, String refreshToken) {

        // [리팩토링] 변경된 레포지토리 메소드 사용
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByUser(user);

        if (tokenOpt.isPresent()) {
            RefreshToken token = tokenOpt.get();
            token.setRefreshToken(refreshToken);
            refreshTokenRepository.save(token); // update

        } else {
            // [리팩토링] UserEntity 객체를 사용하여 새 토큰 생성
            refreshTokenRepository.save(new RefreshToken(user, refreshToken)); // insert
        }
    }

    // 6️⃣ 이메일로 사용자 조회 (없으면 예외)
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));
    }

    // 7️⃣ 이메일 상태 확인 (가입 가능, 활성 중복, 비활성 중복)
    public EmailStatus checkEmailStatus(String email) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return EmailStatus.AVAILABLE; // 사용 가능한 이메일
        }

        UserEntity user = userOptional.get();
        if (user.getStatus() == UserStatus.ACTIVE) {
            return EmailStatus.ACTIVE_DUPLICATE; // 활성 상태의 중복 이메일
        } else {
            return EmailStatus.INACTIVE_DUPLICATE; // 비활성 상태의 중복 이메일
        }
    }

    // 7️⃣-1️⃣ 전화번호 중복 체크 (존재 여부 반환)
    public boolean isPhoneDuplicated(String phone) throws Exception {
        return findUserByPhone(phone).isPresent();
    }

    // 8️⃣ 전화번호 복호화
    public String findPhone(String encryptedPhone) {
        try {
            return AESUtil.decrypt(encryptedPhone);
        } catch (Exception e) {
            throw new RuntimeException("전화번호 복호화 실패", e);
        }
    }

    // 9️⃣ 암호화된 전화번호로 회원 조회
    public Optional<UserEntity> findByEncryptedPhoneNumber(String encryptedPhoneNumber) {
        return userRepository.findByEncryptedPhoneNumber(encryptedPhoneNumber);
    }

    // 🔟 평문 전화번호로 암호화 후 회원 조회
    public Optional<UserEntity> findUserByPhone(String phone) throws Exception {
        String encryptedPhone = AESUtil.encrypt(phone);
        return userRepository.findByEncryptedPhoneNumber(encryptedPhone);
    }

    // 1️⃣1️⃣ 임시 비밀번호 생성 후 DB 저장 및 이메일 전송
    public void sendTempPassword(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        mailService.sendTempPasswordMail(email, tempPassword);
    }

    // 1️⃣2️⃣ 임시 비밀번호 생성 (8자리 영문+숫자)
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random rnd = new Random();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // 1️⃣3️⃣ 임시 비밀번호로 로그인 검증
    @Transactional
    public UserEntity loginWithTempPassword(String email, String tempPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));
        if (!passwordEncoder.matches(tempPassword, user.getPassword())) {
            throw new IllegalArgumentException("임시 비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    // 1️⃣4️⃣ 비밀번호 변경: 현재 비밀번호 검증 → 새 비밀번호 저장
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        String encodedNewPw = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPw);
        userRepository.save(user);
    }

    // 1️⃣5️⃣ 로그아웃: Refresh Token DB에서 삭제
    @Transactional
    public void logout(String email) {
        log.debug("UserService: Starting logout for user: {}", email);
        UserEntity user = getUserByEmail(email);
        log.debug("UserService: User found for email: {}", email);

        // 직접 쿼리 메서드 호출
        refreshTokenRepository.deleteByUserId(user.getUserId());
        refreshTokenRepository.flush(); // 즉시 DB에 반영
        log.info("UserService: Attempted to delete refresh token for user {} using custom query.", email);

        // 삭제 후 다시 조회하여 확인
        if (refreshTokenRepository.findByUser(user).isEmpty()) {
            log.info("UserService: Refresh token successfully verified as deleted from DB for user: {}", email);
        } else {
            log.error("UserService: Refresh token was NOT deleted from DB despite custom query delete call for user: {}", email);
        }
        log.debug("UserService: Logout process finished for user: {}", email);
    }

    // 1️⃣6️⃣ 프로필 이미지 업데이트
    @Transactional
    public void updateProfileImage(Integer userId, String newProfileImageKey) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 기존 프로필 이미지가 있고, 새로운 이미지가 다르면 S3에서 기존 이미지 삭제
        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty() &&
            !user.getProfileImage().equals(newProfileImageKey)) {
            s3Service.deleteFile(user.getProfileImage());
        }

        user.setProfileImage(newProfileImageKey);
        UserEntity updatedUser = userRepository.save(user);

        // 세션 갱신: 새로운 UserEntity 인스턴스를 생성하여 세션에 저장
        // 세션이 객체의 변경을 확실히 감지하도록 도움
        UserEntity sessionUser = new UserEntity();
        sessionUser.setUserId(updatedUser.getUserId());
        sessionUser.setEmail(updatedUser.getEmail());
        sessionUser.setNickname(updatedUser.getNickname());
        sessionUser.setName(updatedUser.getName());
        sessionUser.setProfileImage(updatedUser.getProfileImage()); // 변경된 프로필 이미지 반영
        sessionUser.setLastLoginAt(updatedUser.getLastLoginAt());
        sessionUser.setCreatedAt(updatedUser.getCreatedAt());
        sessionUser.setStatus(updatedUser.getStatus());
        sessionUser.setEncryptedPhoneNumber(updatedUser.getEncryptedPhoneNumber());
        sessionUser.setThemeId(updatedUser.getThemeId());
        // 비밀번호, RefreshToken 등 민감하거나 불필요한 정보는 세션에 저장하지 않음

        session.setAttribute("user", sessionUser);
        log.info("Session user updated: {}", session.getAttribute("user"));
    }

    // 1️⃣7️⃣ 프로필 이미지 삭제
    @Transactional
    public void deleteProfileImage(Integer userId) { // userId는 Integer 유지
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 프로필 이미지가 존재하면 S3에서 삭제
        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty()) {
            s3Service.deleteFile(user.getProfileImage());
        }

        user.setProfileImage(null); // DB에서 프로필 이미지 경로 삭제
        UserEntity updatedUser = userRepository.save(user);

        // 세션 갱신: 새로운 UserEntity 인스턴스를 생성하여 세션에 저장
        UserEntity sessionUser = new UserEntity();
        sessionUser.setUserId(updatedUser.getUserId());
        sessionUser.setEmail(updatedUser.getEmail());
        sessionUser.setNickname(updatedUser.getNickname());
        sessionUser.setName(updatedUser.getName());
        sessionUser.setProfileImage(updatedUser.getProfileImage()); // null로 변경된 프로필 이미지 반영
        sessionUser.setLastLoginAt(updatedUser.getLastLoginAt());
        sessionUser.setCreatedAt(updatedUser.getCreatedAt());
        sessionUser.setStatus(updatedUser.getStatus());
        sessionUser.setEncryptedPhoneNumber(updatedUser.getEncryptedPhoneNumber());
        sessionUser.setThemeId(updatedUser.getThemeId());

        session.setAttribute("user", sessionUser);
        log.info("Session user updated: {}", session.getAttribute("user"));
    }

    // 1️⃣8️⃣ 회원 탈퇴: 사용자 상태를 INACTIVE로 변경
    @Transactional
    public void withdrawUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 사용자 상태를 INACTIVE로 변경
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);

        // 탈퇴 시 Refresh Token도 DB에서 삭제
        refreshTokenRepository.deleteByUserId(userId);
        refreshTokenRepository.flush(); // 즉시 DB에 반영

        log.info("User {} (ID: {}) has been set to INACTIVE status and refresh token deleted.", user.getEmail(), userId);
    }
}