package com.heaildairy.www.auth.repository;

import com.heaildairy.www.auth.entity.UserEntity; // UserEntity 임포트
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmail(String email); // 메서드명 변경 (로그인 ID 기준)

}