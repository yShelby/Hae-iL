package com.heaildairy.www.auth.service;

import com.heaildairy.www.auth.config.AESUtil;
import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.entity.RefreshToken;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.jwt.JwtProvider;
import com.heaildairy.www.auth.repository.RefreshTokenRepository;
import com.heaildairy.www.auth.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;


    // 유저 등록 (register) 메서드
    @Transactional // DB 조작 시 트랜잭션 적용 권장
    public void addNewUser(RegisterRequestDto requestDto) {

        // 전화번호 암호화 메서드
        String encryptedPhone = null;
        try {
            encryptedPhone = AESUtil.encrypt(requestDto.getPhone());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        UserEntity newUser = new UserEntity();
        String hashPassword = passwordEncoder.encode(requestDto.getPassword());

        newUser.setEmail(requestDto.getEmail());
        newUser.setPassword(hashPassword);
        newUser.setName(requestDto.getName());
        newUser.setEncryptedPhoneNumber(encryptedPhone);
        newUser.setNickname(requestDto.getNickname());
        newUser.setProfileImage(requestDto.getProfileImage());

        userRepository.save(newUser);
    }

    // 로그인 메서드
    @Transactional
    public Authentication loginAndAuthenticate(String email, String password)
            throws AuthenticationException {

        // 인증 처리 (Spring Security)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        return authentication;
    }

    // JWT / RefreshToken 발급 및 쿠키 저장, 세션 저장 메서드
    @Transactional
    public void processLoginSuccess(Authentication authentication, String email,
                                    HttpSession session, HttpServletResponse response) {

        // 1. 사용자 정보 조회 및 세션 저장
        UserEntity user = getUserByEmail(email);
        session.setAttribute("user", user);

        // 2. JWT 발급
        String accessToken = jwtProvider.createAccessToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(authentication);

        // 3. RefreshToken DB 저장
        saveOrUpdateRefreshToken(email, refreshToken);

        // 4. 쿠키 저장
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

    // Access Token 재발급 메서드
    public String reissueAccessToken(String refreshToken) {
        // Refresh Token 유효성 검증
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }

        // Refresh Token 에서 이메일 추출
        Claims claims = jwtProvider.extractToken(refreshToken);
        String email = claims.getSubject();

        // DB에 Refresh Token 조회 및 일치 여부 확인
        RefreshToken storedToken = refreshTokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Refresh Token입니다."));

        if (!storedToken.getRefreshToken().equals(refreshToken)) {
            throw new RuntimeException("Refresh Token이 일치하지 않습니다.");
        }

        // 새로운 Access Token 발급
        Authentication authentication = jwtProvider.getAuthentication(refreshToken);
        String newAccessToken = jwtProvider.createAccessToken(authentication);

        // Refresh Token도 새로 발급하고 DB에 저장 (Rotation)
        String newRefreshToken = jwtProvider.createRefreshToken(authentication);
        refreshTokenRepository.deleteByEmail(email);
        refreshTokenRepository.save(new RefreshToken(email, newRefreshToken));

        return newAccessToken;
    }

    // refreshToken 확인 및 업데이트 메소드
    @Transactional
    public void saveOrUpdateRefreshToken(String email, String refreshToken) {

        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByEmail(email);

        if (tokenOpt.isPresent()) {
            RefreshToken token = tokenOpt.get();
            token.setRefreshToken(refreshToken);
            refreshTokenRepository.save(token); // update

        } else {
            refreshTokenRepository.save(new RefreshToken(email, refreshToken)); // insert
        }
    }

    // email 로 사용자 조회 메서드
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));
    }

    // email 중복 확인 메서드
    public boolean isEmailDuplicated(String email) {
        return userRepository.existsByEmail(email);
    }

    // 전화번호 복호화 메서드
    public String findPhone(String encryptedPhone) {
        try {
            return AESUtil.decrypt(encryptedPhone);
        } catch (Exception e) {
            throw new RuntimeException("전화번호 복호화 실패", e);
        }
    }

    // 암호화된 전화번호로 회원 조회 메서드
    public Optional<UserEntity> findByEncryptedPhoneNumber(String encryptedPhoneNumber) {
        return userRepository.findByEncryptedPhoneNumber(encryptedPhoneNumber);
    }

    // 이메일 찾기 메서드
    public Optional<UserEntity> findUserByPhone(String phone) throws Exception {
        String encryptedPhone = AESUtil.encrypt(phone);
        return userRepository.findByEncryptedPhoneNumber(encryptedPhone);
    }

    // 비밀번호 찾기 - 임시 비밀번호 전송 메서드
    public void sendTempPassword(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));
        // 임시 비밀번호 생성
        String tempPassword = generateTempPassword();
        // 임시 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        // 이메일 전송
        mailService.sendTempPasswordMail(email, tempPassword);
    }

    // 임시 비밀번호 생성 (8자리 영문+숫자) 메서드
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random rnd = new Random();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // 임시 비밀번호 사용한 로그인 메서드
    @Transactional
    public UserEntity loginWithTempPassword(String email, String tempPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입된 이메일이 없습니다."));
        if (!passwordEncoder.matches(tempPassword, user.getPassword())) {
            throw new IllegalArgumentException("임시 비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    // 비밀번호 변경 메서드
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));

        // 현재 비밀번호가 맞는지 확인 (암호화된 비밀번호와 비교)
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 암호화 후 저장
        String encodedNewPw = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPw);
        userRepository.save(user);
    }

    // 로그아웃 메서드
    @Transactional
    public void logout(String email) {
        refreshTokenRepository.deleteByEmail(email);
    }

}
