package com.heaildairy.www.auth.service;

import com.heaildairy.www.auth.config.AESUtil;
import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.entity.RefreshToken;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.jwt.JwtProvider;
import com.heaildairy.www.auth.repository.RefreshTokenRepository;
import com.heaildairy.www.auth.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional // DB 조작 시 트랜잭션 적용 권장
    public void addNewUser(RegisterRequestDto requestDto) {
        // 유저 등록 - /register/addNewUser

        // 전화번호 암호화
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

    // email 로 사용자 조회
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));
    }

    // email 중복 확인
    public boolean isEmailDuplicated(String email) {
        return userRepository.existsByEmail(email);
    }

    // 전화번호 복호화
    public String findPhone(String encryptedPhone) {
        try {
            return AESUtil.decrypt(encryptedPhone);
        } catch (Exception e) {
            throw new RuntimeException("전화번호 복호화 실패", e);
        }
    }

    // 암호화된 전화번호로 회원 조회
    public Optional<UserEntity> findByEncryptedPhoneNumber(String encryptedPhoneNumber) {
        return userRepository.findByEncryptedPhoneNumber(encryptedPhoneNumber);
    }

    // 이메일 찾기
    public Optional<UserEntity> findUserByPhone(String phone) throws Exception {
        String encryptedPhone = AESUtil.encrypt(phone);
        return userRepository.findByEncryptedPhoneNumber(encryptedPhone);
    }


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

    // Access Token 재발급
    @Transactional
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

    // 로그아웃
    @Transactional
    public void logout(String email) {
        refreshTokenRepository.deleteByEmail(email);
    }

}
