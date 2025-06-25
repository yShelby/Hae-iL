package com.heaildairy.www.auth.repository;

import com.heaildairy.www.auth.entity.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<TestEntity, Long> {

}
