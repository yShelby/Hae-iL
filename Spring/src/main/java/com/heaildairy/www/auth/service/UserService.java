package com.heaildairy.www.auth.service;

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

        UserEntity newUser = new UserEntity();
        String hashPassword = passwordEncoder.encode(requestDto.getPassword());

        newUser.setEmail(requestDto.getEmail());
        newUser.setPassword(hashPassword);
        newUser.setNickname(requestDto.getNickname());
        newUser.setProfileImage(requestDto.getProfileImage());

        userRepository.save(newUser);
    }

    // 로그인 성공 시 Refresh Token을 DB에 저장 (또는 기존 Refresh Token이 있으면 갱신)
    @Transactional
    public void saveOrUpdateRefreshToken(String email, String refreshToken) {
        // 기존에 Refresh Token이 있으면 삭제
        refreshTokenRepository.deleteByEmail(email);
        // 새로 저장
        refreshTokenRepository.save(new RefreshToken(email, refreshToken));
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



}
