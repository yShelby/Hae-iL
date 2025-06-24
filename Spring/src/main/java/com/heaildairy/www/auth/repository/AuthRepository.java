package com.heaildairy.www.auth.repository;

import com.heaildairy.www.auth.entity.AuthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<AuthEntity, UUID> {

}
