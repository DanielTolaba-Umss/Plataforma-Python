package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    Optional<StudentEntity> findByEmail(String email);
    List<StudentEntity> findByActiveTrue();
    List<StudentEntity> findByCity(String city);
    List<StudentEntity> findByCountry(String country);
    List<StudentEntity> findByCurrentLevel(String currentLevel);
    List<StudentEntity> findByNameContainingIgnoreCase(String name);
    List<StudentEntity> findByLastNameContainingIgnoreCase(String lastName);
    List<StudentEntity> findByEnrollmentDateBetween(java.sql.Date start, java.sql.Date end);
}
