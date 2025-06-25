package com.coders.backers.plataformapython.backend.repositories;

import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentCourseEnrollmentRepository extends JpaRepository<StudentCourseEnrollmentEntity, Long> {
    
    /**
     * Busca una inscripción específica por estudiante y curso
     */
    Optional<StudentCourseEnrollmentEntity> findByStudentAndCourse(StudentEntity student, CourseEntity course);
    
    /**
     * Obtiene todas las inscripciones de un estudiante
     */
    List<StudentCourseEnrollmentEntity> findByStudent(StudentEntity student);
    
    /**
     * Obtiene todas las inscripciones de un curso
     */
    List<StudentCourseEnrollmentEntity> findByCourse(CourseEntity course);
    
    /**
     * Obtiene inscripciones por estado
     */
    List<StudentCourseEnrollmentEntity> findByStatus(EnrollmentStatus status);
      /**
     * Obtiene inscripciones de un estudiante por estado
     */
    List<StudentCourseEnrollmentEntity> findByStudentAndStatus(StudentEntity student, EnrollmentStatus status);
    
    /**
     * Obtiene inscripciones de un curso por estado
     */
    List<StudentCourseEnrollmentEntity> findByCourseAndStatus(CourseEntity course, EnrollmentStatus status);
    
    /**
     * Busca inscripción específica por estudiante, curso y estado
     */
    Optional<StudentCourseEnrollmentEntity> findByStudentAndCourseAndStatus(StudentEntity student, CourseEntity course, EnrollmentStatus status);
    
    /**
     * Verifica si un estudiante está inscrito en un curso específico
     */
    boolean existsByStudentAndCourse(StudentEntity student, CourseEntity course);
    
    /**
     * Obtiene inscripciones activas de un estudiante
     */
    @Query("SELECT sce FROM StudentCourseEnrollmentEntity sce WHERE sce.student = :student AND sce.status = 'ACTIVE'")
    List<StudentCourseEnrollmentEntity> findActiveEnrollmentsByStudent(@Param("student") StudentEntity student);
    
    /**
     * Cuenta el número de estudiantes inscritos en un curso
     */
    long countByCourse(CourseEntity course);
    
    /**
     * Cuenta el número de estudiantes activos en un curso
     */
    long countByCourseAndStatus(CourseEntity course, EnrollmentStatus status);
}
