package com.haeildiary.www.selfdiagnosis.repository;

import com.haeildiary.www.selfdiagnosis.common.CommonSelfDiagnosisRepository;
import com.haeildiary.www.selfdiagnosis.entity.StressSelfDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StressRepository extends
        JpaRepository<StressSelfDiagnosis, Integer>,
        CommonSelfDiagnosisRepository<StressSelfDiagnosis> {
}
