package com.coders.backers.plataformapython.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.coders.backers.plataformapython.backend.models.LessonEntity;

@Repository
public interface LessonRepository extends JpaRepository<LessonEntity, Long> {
    List<LessonEntity> findByActive(boolean active);
    List<LessonEntity> findByTitle(String title);
    List<LessonEntity> findByTitleContainingIgnoreCase(String title);
    List<LessonEntity> findByCourseId(Long courseId);
    List<LessonEntity> findByCourseIdAndActive(Long courseId, boolean active);
    List<LessonEntity> findByCourseIdIn(List<Long> courseIds);
    List<LessonEntity> findByCourseIdInAndActive(List<Long> courseIds, boolean active);
    
    boolean existsByTitleAndCourseId(String title, Long courseId);
}