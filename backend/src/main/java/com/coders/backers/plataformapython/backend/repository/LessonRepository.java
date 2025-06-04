package com.coders.backers.plataformapython.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    // Nuevo método para buscar lecciones por courseId y nivel del curso
    @Query("SELECT l FROM LessonEntity l WHERE l.course.id = :courseId AND l.course.level = :level")
    List<LessonEntity> findByCourseIdAndCourseLevel(@Param("courseId") Long courseId, @Param("level") String level);
    
    @Query("SELECT l FROM LessonEntity l WHERE l.course.id = :courseId AND l.course.level = :level AND l.active = :active")
    List<LessonEntity> findByCourseIdAndCourseLevelAndActive(@Param("courseId") Long courseId, @Param("level") String level, @Param("active") boolean active);
    
    boolean existsByTitleAndCourseId(String title, Long courseId);
}