package com.heaildairy.www.auth.service;

import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional // DB 조작 시 트랜잭션 적용 권장
    public void addNewUser(RegisterRequestDto requestDto) {

        UserEntity newUser = new UserEntity();
        String hashPassword = passwordEncoder.encode(requestDto.getPassword());

        newUser.setEmail(requestDto.getEmail());
        newUser.setPassword(hashPassword);
        newUser.setNickname(requestDto.getNickname());
        newUser.setProfileImage(requestDto.getProfileImage());

        userRepository.save(newUser);
    }

}
