package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.TestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCaseEntity, Long> {
    List<TestCaseEntity> findByPractice_Id(Long practiceId);
    Long countByPractice_Id(Long practiceId);
}