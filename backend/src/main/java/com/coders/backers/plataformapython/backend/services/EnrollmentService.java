package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.enums.EnrollmentStatus;
import com.coders.backers.plataformapython.backend.repositories.StudentCourseEnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private StudentCourseEnrollmentRepository enrollmentRepository;
    
    @Autowired
    private ProgressService progressService;

    /**
     * Inscribir un estudiante en un curso
     */
    @Transactional
    public StudentCourseEnrollmentEntity enrollStudentInCourse(StudentEntity student, CourseEntity course) {
        // Verificar si ya existe una inscripción activa
        Optional<StudentCourseEnrollmentEntity> existingEnrollment = 
            enrollmentRepository.findByStudentAndCourseAndStatus(student, course, EnrollmentStatus.ACTIVE);
        
        if (existingEnrollment.isPresent()) {
            return existingEnrollment.get(); // Ya está inscrito
        }

        // Crear nueva inscripción
        StudentCourseEnrollmentEntity enrollment = new StudentCourseEnrollmentEntity();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollment.setEnrollmentDate(Date.valueOf(LocalDate.now()));
        
        // Guardar la inscripción primero
        enrollment = enrollmentRepository.save(enrollment);
        
        // Inicializar el progreso para todas las lecciones del curso
        progressService.initializeCourseProgress(student, course, enrollment);
        
        return enrollment;
    }

    /**
     * Completar la inscripción de un estudiante en un curso
     */
    @Transactional
    public StudentCourseEnrollmentEntity completeEnrollment(Long enrollmentId) {
        StudentCourseEnrollmentEntity enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
        
        enrollment.setStatus(EnrollmentStatus.COMPLETED);
        enrollment.setCompletionDate(Date.valueOf(LocalDate.now()));
        
        return enrollmentRepository.save(enrollment);
    }

    /**
     * Obtener todas las inscripciones de un estudiante
     */
    public List<StudentCourseEnrollmentEntity> getStudentEnrollments(StudentEntity student) {
        return enrollmentRepository.findByStudent(student);
    }

    /**
     * Obtener todas las inscripciones activas de un estudiante
     */
    public List<StudentCourseEnrollmentEntity> getActiveStudentEnrollments(StudentEntity student) {
        return enrollmentRepository.findByStudentAndStatus(student, EnrollmentStatus.ACTIVE);
    }

    /**
     * Obtener todos los estudiantes inscritos en un curso
     */
    public List<StudentCourseEnrollmentEntity> getCourseEnrollments(CourseEntity course) {
        return enrollmentRepository.findByCourse(course);
    }

    /**
     * Obtener todos los estudiantes activos en un curso
     */
    public List<StudentCourseEnrollmentEntity> getActiveCourseEnrollments(CourseEntity course) {
        return enrollmentRepository.findByCourseAndStatus(course, EnrollmentStatus.ACTIVE);
    }

    /**
     * Verificar si un estudiante está inscrito en un curso
     */
    public boolean isStudentEnrolledInCourse(StudentEntity student, CourseEntity course) {
        return enrollmentRepository.findByStudentAndCourseAndStatus(student, course, EnrollmentStatus.ACTIVE)
            .isPresent();
    }

    /**
     * Obtener inscripción específica por estudiante y curso
     */
    public Optional<StudentCourseEnrollmentEntity> getEnrollment(StudentEntity student, CourseEntity course) {
        return enrollmentRepository.findByStudentAndCourse(student, course);
    }
}
