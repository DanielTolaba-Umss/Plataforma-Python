package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.student.StudentCourseDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentLessonDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProfileDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProgressDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentProfileDto;
import com.coders.backers.plataformapython.backend.enums.LessonProgressStatus;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.models.StudentLessonProgressEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.repositories.StudentCourseEnrollmentRepository;
import com.coders.backers.plataformapython.backend.repositories.StudentLessonProgressRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.services.StudentProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentProfileServiceImpl implements StudentProfileService {

    private final StudentRepository studentRepository;
    private final StudentCourseEnrollmentRepository enrollmentRepository;
    private final StudentLessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;

    @Override
    public StudentProfileDto getStudentProfile(String email) {
        log.info("Obteniendo perfil para estudiante: {}", email);
        
        StudentEntity student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));

        return new StudentProfileDto(
                student.getId(),
                student.getName(),
                student.getLastName(),
                student.getEmail(),
                student.getPhone(),
                student.getCreatedAt() != null ? student.getCreatedAt().toLocalDate() : LocalDate.now(),
                student.isActive(),
                "STUDENT"
        );
    }

    @Override
    @Transactional
    public StudentProfileDto updateStudentProfile(String email, UpdateStudentProfileDto updateDto) {
        log.info("Actualizando perfil para estudiante: {}", email);
        
        StudentEntity student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));

        // Verificar si el nuevo email ya existe (si es diferente al actual)
        if (!email.equals(updateDto.getEmail()) && 
            studentRepository.findByEmail(updateDto.getEmail()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese email: " + updateDto.getEmail());
        }

        // Actualizar datos
        student.setName(updateDto.getNombres());
        student.setLastName(updateDto.getApellidos());
        student.setEmail(updateDto.getEmail());
        student.setPhone(updateDto.getTelefono());

        StudentEntity savedStudent = studentRepository.save(student);
        
        return new StudentProfileDto(
                savedStudent.getId(),
                savedStudent.getName(),
                savedStudent.getLastName(),
                savedStudent.getEmail(),
                savedStudent.getPhone(),
                savedStudent.getCreatedAt() != null ? savedStudent.getCreatedAt().toLocalDate() : LocalDate.now(),
                savedStudent.isActive(),
                "STUDENT"
        );
    }

    @Override
    public List<StudentCourseDto> getStudentCourses(String email) {
        log.info("Obteniendo cursos para estudiante: {}", email);
        
        StudentEntity student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));

        List<StudentCourseEnrollmentEntity> enrollments = enrollmentRepository.findByStudent(student);
          return enrollments.stream().map(enrollment -> {
            CourseEntity course = enrollment.getCourse();
            
            // Obtener progreso del curso usando el método correcto
            List<StudentLessonProgressEntity> lessonProgress = 
                progressRepository.findByStudentAndCourseId(student, course.getId());
            
            // Calcular total de lecciones del curso usando el método correcto
            int totalLessons = lessonRepository.findByCourseIdAndActive(course.getId(), true).size();
              // Calcular lecciones completadas usando el estado COMPLETED
            int completedLessons = (int) lessonProgress.stream()
                    .filter(progress -> progress.getStatus() == LessonProgressStatus.COMPLETED)
                    .count();
            
            // Calcular progreso porcentual
            int progressPercentage = totalLessons > 0 ? (completedLessons * 100) / totalLessons : 0;
            
            return new StudentCourseDto(
                    course.getId(),
                    course.getTitle(),
                    course.getLevel(),
                    course.getDescription(),
                    progressPercentage,
                    enrollment.getEnrollmentDate() != null ? 
                        enrollment.getEnrollmentDate().toLocalDate() : LocalDate.now(),
                    progressPercentage == 100,
                    totalLessons,
                    completedLessons
            );
        }).collect(Collectors.toList());
    }    @Override
    public StudentProgressDto getStudentProgress(String email) {
        log.info("Obteniendo progreso general para estudiante: {}", email);

        List<StudentCourseDto> courses = getStudentCourses(email);
        
        // Calcular estadísticas generales
        int cursosInscritos = courses.size();
        int cursosCompletados = (int) courses.stream().filter(StudentCourseDto::isCompletado).count();
        int leccionesCompletadas = courses.stream().mapToInt(StudentCourseDto::getLeccionesCompletadas).sum();
        
        // Determinar nivel actual (curso con mayor progreso que no esté completado)
        String nivelActual = courses.stream()
                .filter(course -> !course.isCompletado())
                .max((c1, c2) -> Integer.compare(c1.getProgreso(), c2.getProgreso()))
                .map(StudentCourseDto::getLevel)
                .orElse(courses.stream()
                        .filter(StudentCourseDto::isCompletado)
                        .map(StudentCourseDto::getLevel)
                        .findFirst()
                        .orElse("Básico"));
        
        // Calcular progreso general
        int progresoGeneral = courses.isEmpty() ? 0 : 
                courses.stream().mapToInt(StudentCourseDto::getProgreso).sum() / courses.size();
        
        // Filtrar cursos activos (no completados)
        List<StudentCourseDto> cursosActivos = courses.stream()
                .filter(course -> !course.isCompletado())
                .collect(Collectors.toList());

        return new StudentProgressDto(
                nivelActual,
                leccionesCompletadas,
                cursosCompletados, // Por ahora las certificaciones = cursos completados
                cursosInscritos,
                cursosCompletados,
                cursosActivos,
                progresoGeneral
        );
    }

    @Override
    public List<StudentLessonDto> getStudentCourseLessons(String email, Long courseId) {
        log.info("Obteniendo lecciones del curso {} para estudiante: {}", courseId, email);
        
        StudentEntity student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));

        // Verificar que el estudiante esté inscrito en el curso
        List<StudentCourseEnrollmentEntity> enrollments = enrollmentRepository.findByStudent(student);
        boolean isEnrolled = enrollments.stream()
                .anyMatch(enrollment -> enrollment.getCourse().getId().equals(courseId));
                
        if (!isEnrolled) {
            throw new RuntimeException("El estudiante no está inscrito en este curso");
        }

        // Obtener todas las lecciones del curso
        List<LessonEntity> courseLessons = lessonRepository.findByCourseIdAndActive(courseId, true);
        
        // Obtener el progreso del estudiante para cada lección
        List<StudentLessonProgressEntity> studentProgress = 
                progressRepository.findByStudentAndCourseId(student, courseId);
        
        return courseLessons.stream().map(lesson -> {
            // Buscar el progreso específico de esta lección
            StudentLessonProgressEntity progress = studentProgress.stream()
                    .filter(p -> p.getLesson().getId().equals(lesson.getId()))
                    .findFirst()
                    .orElse(null);
            
            return new StudentLessonDto(
                    lesson.getId(),
                    lesson.getTitle(),
                    lesson.getDescription(),
                    lesson.getCourse().getId(),
                    lesson.getCourse().getTitle(),
                    progress != null && progress.getStatus() == LessonProgressStatus.COMPLETED,
                    progress != null && progress.getCompletionDate() != null ? 
                        progress.getCompletionDate().toLocalDate() : null,
                    progress != null && progress.getStartDate() != null ? 
                        progress.getStartDate().toLocalDate() : null,                    progress != null ? progress.getTimeSpentMinutes() : 0,
                    progress != null ? progress.getPracticeAttempts() : 0,
                    progress != null && progress.getBestPracticeScore() != null ? 
                        progress.getBestPracticeScore().doubleValue() : null,
                    progress != null && progress.getLastPracticeScore() != null ? 
                        progress.getLastPracticeScore().doubleValue() : null,
                    progress != null && progress.getPracticeCompleted() != null && progress.getPracticeCompleted(),
                    progress != null ? progress.getStatus().name() : "NOT_STARTED"
            );
        }).collect(Collectors.toList());
    }
}
