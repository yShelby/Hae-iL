<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/UserService.java
package com.haeildiary.www.auth.service;

import com.haeildiary.www.auth.config.AESUtil;
import com.haeildiary.www.auth.dto.RegisterRequestDto;
import com.haeildiary.www.auth.entity.RefreshToken;
import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.jwt.JwtProvider;
import com.haeildiary.www.auth.repository.RefreshTokenRepository;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.auth.user.UserStatus;
import com.haeildiary.www.s3.service.S3Service; // S3Service 임포트 추가
========
package com.haeildairy.www.auth.service;

import com.haeildairy.www.auth.config.AESUtil;
import com.haeildairy.www.auth.dto.RegisterRequestDto;
import com.haeildairy.www.auth.entity.RefreshToken;
import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.auth.jwt.JwtProvider;
import com.haeildairy.www.auth.repository.RefreshTokenRepository;
import com.haeildairy.www.auth.repository.UserRepository;
import com.haeildairy.www.auth.user.UserStatus;
import com.haeildairy.www.s3.service.S3Service; // S3Service 임포트 추가
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/UserService.java
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // <-- 이 줄 추가
import java.util.Optional;
import java.util.Random;

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
            String normalizedPhone = normalizePhoneNumber(requestDto.getPhone());
            if (normalizedPhone == null) {
                throw new IllegalArgumentException("지원하지 않는 전화번호 형식입니다.");
            }
            encryptedPhone = AESUtil.encrypt(normalizedPhone); // 정규화된 번호를 암호화
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

        UserEntity savedUser = userRepository.save(newUser); // DB 저장

        String tempProfileImagePath = requestDto.getProfileImage();
        if (tempProfileImagePath != null && !tempProfileImagePath.isEmpty()) {
            String fileExtension = "";
            int dotIndex = tempProfileImagePath.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < tempProfileImagePath.length() - 1) {
                fileExtension = tempProfileImagePath.substring(dotIndex);
            }
            String permanentProfileImagePath = "profile_images/" + savedUser.getUserId() + "/profile" + fileExtension;

            boolean moved = s3Service.moveS3Object(tempProfileImagePath, permanentProfileImagePath);

            if (moved) {
                savedUser.setProfileImage(permanentProfileImagePath);
                userRepository.save(savedUser);
            } else {
                log.error("Failed to move profile image from {} to {}", tempProfileImagePath, permanentProfileImagePath);
            }
        }
    }

    // 전화번호 정규화 메서드
    private String normalizePhoneNumber(String phone) {
        if (phone == null || phone.isBlank()) {
            log.warn("전화번호가 비어있습니다.");
            return null;
        }
        // 숫자만 추출 (하이픈 등 제거)
        String cleaned = phone.replaceAll("\\D", "");

        // 유효한 길이인지 먼저 검사 (한국 전화번호 기준 10~11자리)
        if (cleaned.length() < 10 || cleaned.length() > 12) {
            log.warn("전화번호 길이가 유효하지 않습니다: {}", phone);
            return null;
        }

        // '010'으로 시작하는 11자리 번호인 경우 '+8210'으로 변환
        if (cleaned.startsWith("010") && cleaned.length() == 11) {
            return "+82" + cleaned.substring(1);
        }
        // '8210'으로 시작하는 12자리 번호인 경우 '+' 추가
        if (cleaned.startsWith("8210") && cleaned.length() == 12) {
            return "+" + cleaned;
        }
        // 이미 '+82'로 시작하는 13자리 번호인 경우 (프론트에서 넘어온 올바른 형식)
        if (phone.startsWith("+82") && cleaned.length() == 12) { // cleaned는 8210... 형태
            return phone;
        }

        log.warn("지원하지 않는 전화번호 형식입니다: {}", phone);
        return null; // 지원하지 않는 형식이면 null 반환
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

        UserEntity user = getUserByEmail(email);
        session.setAttribute("user", user);

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtProvider.createAccessToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(authentication);

        saveOrUpdateRefreshToken(user, refreshToken);

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
    @Transactional
    public String reissueAccessToken(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }

        Claims claims = jwtProvider.extractToken(refreshToken);
        String email = claims.getSubject();
        UserEntity user = getUserByEmail(email);

        RefreshToken storedToken = refreshTokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Refresh Token입니다."));

        if (!storedToken.getRefreshToken().equals(refreshToken)) {
            throw new RuntimeException("Refresh Token이 일치하지 않습니다.");
        }

        Authentication authentication = jwtProvider.getAuthentication(refreshToken);
        String newAccessToken = jwtProvider.createAccessToken(authentication);
        String newRefreshToken = jwtProvider.createRefreshToken(authentication);

        storedToken.setRefreshToken(newRefreshToken);
        refreshTokenRepository.save(storedToken);

        return newAccessToken;
    }

    // 5️⃣ Refresh Token DB 저장 혹은 갱신
    @Transactional
    public void saveOrUpdateRefreshToken(UserEntity user, String refreshToken) {

        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByUser(user);

        if (tokenOpt.isPresent()) {
            RefreshToken token = tokenOpt.get();
            token.setRefreshToken(refreshToken);
            refreshTokenRepository.save(token); // update

        } else {
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
            return EmailStatus.AVAILABLE;
        }

        UserEntity user = userOptional.get();
        if (user.getStatus() == UserStatus.ACTIVE) {
            return EmailStatus.ACTIVE_DUPLICATE;
        } else {
            return EmailStatus.INACTIVE_DUPLICATE;
        }
    }

    // 7️⃣-1️⃣ 전화번호 상태 확인 (가입 가능, 활성 중복, 비활성 중복)
    public PhoneStatus checkPhoneStatus(String phone) throws Exception {
        Optional<UserEntity> userOptional = findUserByPhone(phone);

        if (userOptional.isEmpty()) {
            return PhoneStatus.AVAILABLE;
        }

        UserEntity user = userOptional.get();
        if (user.getStatus() == UserStatus.ACTIVE) {
            return PhoneStatus.ACTIVE_DUPLICATE;
        } else {
            return PhoneStatus.INACTIVE_DUPLICATE;
        }
    }

    // 7️⃣-2️⃣ 이메일 찾기 시 전화번호 상태 확인
    public EmailFindStatus checkPhoneForEmailFind(String phone) throws Exception {
        Optional<UserEntity> userOptional = findUserByPhone(phone);

        if (userOptional.isEmpty()) {
            return EmailFindStatus.NOT_FOUND;
        }

        UserEntity user = userOptional.get();
        if (user.getStatus() == UserStatus.ACTIVE) {
            return EmailFindStatus.ACTIVE_USER_FOUND;
        } else {
            return EmailFindStatus.INACTIVE_USER_FOUND;
        }
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
        // [수정] 전화번호를 표준 형식으로 정규화
        String normalizedPhone = normalizePhoneNumber(phone);
        if (normalizedPhone == null) {
            return Optional.empty(); // 지원하지 않는 형식이면 빈 결과를 반환
        }
        String encryptedPhone = AESUtil.encrypt(normalizedPhone);
        return userRepository.findByEncryptedPhoneNumber(encryptedPhone);
    }

    // 1️⃣1️⃣ 임시 비밀번호 생성 후 DB 저장 및 이메일 전송
    public void sendTempPassword(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));

        // [추가] 사용자의 상태를 확인하는 로직
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new IllegalArgumentException("탈퇴한 회원의 이메일입니다.");
        }

        // ACTIVE 상태의 사용자만 아래 로직을 실행
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

        refreshTokenRepository.deleteByUserId(user.getUserId());
        refreshTokenRepository.flush();
        log.info("UserService: Attempted to delete refresh token for user {} using custom query.", email);

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

        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty() &&
            !user.getProfileImage().equals(newProfileImageKey)) {
            s3Service.deleteFile(user.getProfileImage());
        }

        user.setProfileImage(newProfileImageKey);
        UserEntity updatedUser = userRepository.save(user);

        UserEntity sessionUser = new UserEntity();
        sessionUser.setUserId(updatedUser.getUserId());
        sessionUser.setEmail(updatedUser.getEmail());
        sessionUser.setNickname(updatedUser.getNickname());
        sessionUser.setName(updatedUser.getName());
        sessionUser.setProfileImage(updatedUser.getProfileImage());
        sessionUser.setLastLoginAt(updatedUser.getLastLoginAt());
        sessionUser.setCreatedAt(updatedUser.getCreatedAt());
        sessionUser.setStatus(updatedUser.getStatus());
        sessionUser.setEncryptedPhoneNumber(updatedUser.getEncryptedPhoneNumber());
        sessionUser.setThemeId(updatedUser.getThemeId());

        session.setAttribute("user", sessionUser);
        log.info("Session user updated: {}", session.getAttribute("user"));
    }

    // 1️⃣7️⃣ 프로필 이미지 삭제
    @Transactional
    public void deleteProfileImage(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty()) {
            s3Service.deleteFile(user.getProfileImage());
        }

        user.setProfileImage(null);
        UserEntity updatedUser = userRepository.save(user);

        UserEntity sessionUser = new UserEntity();
        sessionUser.setUserId(updatedUser.getUserId());
        sessionUser.setEmail(updatedUser.getEmail());
        sessionUser.setNickname(updatedUser.getNickname());
        sessionUser.setName(updatedUser.getName());
        sessionUser.setProfileImage(updatedUser.getProfileImage());
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

        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);

        refreshTokenRepository.deleteByUserId(userId);
        refreshTokenRepository.flush();

        log.info("User {} (ID: {}) has been set to INACTIVE status and refresh token deleted.", user.getEmail(), userId);
    }
}
