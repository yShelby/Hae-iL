package com.haeildairy.www.auth.repository;

import com.haeildairy.www.auth.entity.UserEntity; // UserEntity 임포트
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email); // 이메일 사용자 조회
    boolean existsByEmail(String email);            // 이메일 중복 체크
    Optional<UserEntity> findByEncryptedPhoneNumber(String encryptedPhoneNumber); // 암호 전화번호 사용자 조회

}