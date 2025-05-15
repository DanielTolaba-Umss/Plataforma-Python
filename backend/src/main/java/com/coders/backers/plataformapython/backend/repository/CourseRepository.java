package com.coders.backers.plataformapython.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.coders.backers.plataformapython.backend.models.CourseEntity;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    List<CourseEntity> findByActive(boolean active);
    List<CourseEntity> findByTitle(String title);
    List<CourseEntity> findByTitleContainingIgnoreCase(String title);
    List<CourseEntity> findByOrdenGreaterThan(int orden);
    List<CourseEntity> findByLevel(String level);

    boolean existsByTitle(String title);
}