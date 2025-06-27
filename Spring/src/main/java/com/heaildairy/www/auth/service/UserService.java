package com.heaildairy.www.auth.service;

import com.heaildairy.www.auth.dto.RegisterRequestDto;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
