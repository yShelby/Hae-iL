package com.haeildairy.www.auth.repository;

import com.haeildairy.www.auth.entity.RefreshToken;
import com.haeildairy.www.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // [리팩토링] email 기반 검색을 UserEntity 객체 기반으로 변경하여 객체지향적으로 개선
    Optional<RefreshToken> findByUser(UserEntity user);

    // userId를 기반으로 RefreshToken을 직접 삭제하는 커스텀 쿼리
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.userId = :userId")
    void deleteByUserId(Integer userId);
}