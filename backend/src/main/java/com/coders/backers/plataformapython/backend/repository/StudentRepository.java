package com.coders.backers.plataformapython.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.coders.backers.plataformapython.backend.models.StudentModel;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentModel, Long> {
    boolean existsByEmail(String email);
    Optional<StudentModel> findByEmail(String email);
}