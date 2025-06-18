package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.StudentProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentProgressRepository extends JpaRepository<StudentProgressEntity, Long> {
    List<StudentProgressEntity> findByStudentId(Long studentId);
}