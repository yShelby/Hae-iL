package com.heaildairy.www.auth.service;


import com.heaildairy.www.auth.user.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // DB에서 email(유저ID) 찾아서
        // return new User(유저이메일, 비번, 권한)

        Optional<UserEntity> result = userRepository.findByEmail(email); // findByEmail 호출
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("존재하지 않는 이메일입니다.");
        }
        UserEntity user = result.get();

        List<GrantedAuthority> authorities = new ArrayList<>(); // 권한 리스트 생성
        authorities.add(new SimpleGrantedAuthority("USER")); // 기본 역할 (필요시 UserEntity에서 가져옴)

        // CustomUser 생성 시 email과 nickname, 그리고 DB에서 가져온 password 사용
        CustomUser thisUser = new CustomUser(
                user.getEmail(), user.getPassword(), authorities,
                user.getUserId(), user.getNickname(), user.getProfileImage(),
                user.getThemeId(), user.getLastLoginAt(), user.getCreatedAt()
        );

        return thisUser;
    }
}