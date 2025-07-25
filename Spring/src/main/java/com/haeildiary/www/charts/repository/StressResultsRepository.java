package com.haeildiary.www.charts.repository;

import com.haeildiary.www.selfdiagnosis.entity.StressSelfDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StressResultsRepository extends JpaRepository<StressSelfDiagnosis, Integer> {
}
