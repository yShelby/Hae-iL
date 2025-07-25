package com.haeildiary.www.charts.repository;

import com.haeildiary.www.selfdiagnosis.entity.DepressionSelfDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepressionResultsRepository extends JpaRepository<DepressionSelfDiagnosis, Integer> {
}
