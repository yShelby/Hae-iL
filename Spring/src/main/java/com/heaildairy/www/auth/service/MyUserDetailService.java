package com.heaildairy.www.auth.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.auth.user.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * 📂 MyUserDetailService.java
 * ────────────────────────────────
 * ✅ 역할:
 * - Spring Security에서 인증 처리 시 사용자 상세정보 조회 담당
 * - 이메일 기준으로 사용자 정보 DB 조회
 * - 조회된 정보를 CustomUser 객체로 감싸서 반환 (인증과 권한 관리용)
 *
 * 📊 데이터 흐름도
 * 1️⃣ 이메일로 DB 조회 (UserRepository.findByEmail)
 * 2️⃣ 사용자 없으면 예외 발생 (UsernameNotFoundException)
 * 3️⃣ 사용자 있으면 기본 권한 ROLE_USER 할당
 * 4️⃣ DB에서 가져온 정보 기반 CustomUser 생성 및 반환
 */

@Service
@RequiredArgsConstructor
public class MyUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1️⃣ 이메일로 사용자 조회
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 이메일입니다: " + email));

        // 2️⃣ 모든 사용자에게 기본 ROLE_USER 권한 할당 (간단히 리스트 생성)
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

        // 3️⃣ CustomUser 객체 생성 (인증용 principal)
        return new CustomUser(
                user.getEmail(),           // 사용자 이메일 (username)
                user.getPassword(),        // 비밀번호 (암호화된 상태)
                authorities,               // 권한 리스트
                user.getUserId(),          // 유저 고유 ID
                user.getNickname(),        // 닉네임
                user.getProfileImage(),    // 프로필 이미지 경로 또는 URL
                user.getThemeId(),         // 테마 아이디 (사용자 선호)
                user.getLastLoginAt(),     // 마지막 로그인 시간
                user.getCreatedAt()        // 계정 생성일
        );
    }
}
