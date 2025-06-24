package com.heaildairy.www.auth.service;


import com.heaildairy.www.auth.dto.AuthDTO;
import com.heaildairy.www.auth.entity.AuthEntity;
import com.heaildairy.www.auth.repository.AuthRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;

    public void save(AuthDTO dto){
        AuthEntity order = new AuthEntity(dto.menu(), dto.count());
        authRepository.save(order);
    }

}
