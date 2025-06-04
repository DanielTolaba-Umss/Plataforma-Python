package com.coders.backers.plataformapython.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    List<TeacherEntity> findByActive(boolean active);
    List<TeacherEntity> findByName(String name);
    List<TeacherEntity> findBySpecialty(String specialty);
    List<TeacherEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
