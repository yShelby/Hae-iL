<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/MyUserDetailService.java
package com.haeildiary.www.auth.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.auth.user.CustomUser;
========
package com.haeildairy.www.auth.service;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.auth.repository.UserRepository;
import com.haeildairy.www.auth.user.CustomUser;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/MyUserDetailService.java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/MyUserDetailService.java
import com.haeildiary.www.auth.user.UserStatus;
========
import com.haeildairy.www.auth.user.UserStatus;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/MyUserDetailService.java

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

@Slf4j
@Service
@RequiredArgsConstructor
public class MyUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1️⃣ 이메일로 사용자 조회
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 이메일입니다: " + email));

        // 2️⃣ 사용자 상태 확인 (탈퇴 회원 체크)
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new DisabledException("탈퇴한 회원입니다.");
        }

        // 3️⃣ 모든 사용자에게 기본 ROLE_USER 권한 할당 (간단히 리스트 생성)
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

        // 4️⃣ CustomUser 객체 생성 (인증용 principal)
        return new CustomUser(
                user.getEmail(),           // 사용자 이메일 (username)
                user.getPassword(),        // 비밀번호 (암호화된 상태)
                authorities,               // 권한 리스트
                user.getUserId(),          // 유저 고유 ID
                user.getNickname(),        // 닉네임
                user.getProfileImage(),    // 프로필 이미지 경로 또는 URL
                user.getThemeId() != null ? user.getThemeId() : null,         // 테마 아이디 (사용자 선호)
                user.getLastLoginAt() != null ? user.getLastLoginAt() : null,     // 마지막 로그인 시간
                user.getCreatedAt() != null ? user.getCreatedAt() : null        // 계정 생성일
            );
    }
}
