package com.coders.backers.plataformapython.backend.repositories;

import com.coders.backers.plataformapython.backend.models.StudentLessonProgressEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.enums.LessonProgressStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentLessonProgressRepository extends JpaRepository<StudentLessonProgressEntity, Long> {
    
    /**
     * Busca el progreso específico de un estudiante en una lección
     */
    Optional<StudentLessonProgressEntity> findByStudentAndLesson(StudentEntity student, LessonEntity lesson);
    
    /**
     * Obtiene todo el progreso de un estudiante
     */
    List<StudentLessonProgressEntity> findByStudent(StudentEntity student);
    
    /**
     * Obtiene el progreso de todos los estudiantes en una lección específica
     */
    List<StudentLessonProgressEntity> findByLesson(LessonEntity lesson);
    
    /**
     * Obtiene el progreso de un estudiante por estado
     */
    List<StudentLessonProgressEntity> findByStudentAndStatus(StudentEntity student, LessonProgressStatus status);
    
    /**
     * Obtiene el progreso por estado específico
     */
    List<StudentLessonProgressEntity> findByStatus(LessonProgressStatus status);
    
    /**
     * Verifica si existe progreso para un estudiante en una lección
     */
    boolean existsByStudentAndLesson(StudentEntity student, LessonEntity lesson);
    
    /**
     * Obtiene lecciones completadas por un estudiante
     */
    @Query("SELECT slp FROM StudentLessonProgressEntity slp WHERE slp.student = :student AND slp.status = 'COMPLETED'")
    List<StudentLessonProgressEntity> findCompletedLessonsByStudent(@Param("student") StudentEntity student);
    
    /**
     * Obtiene lecciones en progreso por un estudiante
     */
    @Query("SELECT slp FROM StudentLessonProgressEntity slp WHERE slp.student = :student AND slp.status = 'IN_PROGRESS'")
    List<StudentLessonProgressEntity> findInProgressLessonsByStudent(@Param("student") StudentEntity student);
    
    /**
     * Cuenta el número de lecciones completadas por un estudiante
     */
    @Query("SELECT COUNT(slp) FROM StudentLessonProgressEntity slp WHERE slp.student = :student AND slp.status = 'COMPLETED'")
    long countCompletedLessonsByStudent(@Param("student") StudentEntity student);
    
    /**
     * Obtiene el progreso de un estudiante en lecciones de un curso específico
     */
    @Query("SELECT slp FROM StudentLessonProgressEntity slp WHERE slp.student = :student AND slp.lesson.course.id = :courseId")
    List<StudentLessonProgressEntity> findByStudentAndCourseId(@Param("student") StudentEntity student, @Param("courseId") Long courseId);
    
    /**
     * Cuenta lecciones completadas de un curso por un estudiante
     */
    @Query("SELECT COUNT(slp) FROM StudentLessonProgressEntity slp WHERE slp.student = :student AND slp.lesson.course.id = :courseId AND slp.status = 'COMPLETED'")
    long countCompletedLessonsByCourse(@Param("student") StudentEntity student, @Param("courseId") Long courseId);
}
