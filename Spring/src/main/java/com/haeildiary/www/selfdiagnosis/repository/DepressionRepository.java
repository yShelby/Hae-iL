package com.haeildiary.www.selfdiagnosis.repository;

import com.haeildiary.www.selfdiagnosis.common.CommonSelfDiagnosisRepository;
import com.haeildiary.www.selfdiagnosis.entity.DepressionSelfDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepressionRepository extends
        JpaRepository<DepressionSelfDiagnosis, Integer>,
        CommonSelfDiagnosisRepository<DepressionSelfDiagnosis> {
}
