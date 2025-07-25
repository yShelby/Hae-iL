package com.haeildiary.www.charts.repository;

import com.haeildiary.www.charts.dto.DiagnosisResultsDto;
import com.haeildiary.www.selfdiagnosis.entity.AnxietySelfDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AnxietyResultsRepository extends JpaRepository<AnxietySelfDiagnosis, Integer> {
    @Query("""
            """)
    List<DiagnosisResultsDto> findDiagnosisResultsBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
