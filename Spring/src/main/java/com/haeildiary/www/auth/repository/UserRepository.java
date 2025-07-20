<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/repository/UserRepository.java
package com.haeildiary.www.auth.repository;

import com.haeildiary.www.auth.entity.UserEntity; // UserEntity 임포트
========
package com.haeildairy.www.auth.repository;

import com.haeildairy.www.auth.entity.UserEntity; // UserEntity 임포트
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/repository/UserRepository.java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email); // 이메일 사용자 조회
    boolean existsByEmail(String email);            // 이메일 중복 체크
    Optional<UserEntity> findByEncryptedPhoneNumber(String encryptedPhoneNumber); // 암호 전화번호 사용자 조회

}