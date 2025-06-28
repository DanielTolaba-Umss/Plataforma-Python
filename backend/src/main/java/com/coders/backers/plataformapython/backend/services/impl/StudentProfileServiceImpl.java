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
import java.util.Optional;
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
            
            // Actualizar totales en la inscripción si es necesario
            if (totalLessons != enrollment.getTotalLessons() || 
                completedLessons != enrollment.getCompletedLessons()) {
                enrollment.setTotalLessons(totalLessons);
                enrollment.setCompletedLessons(completedLessons);
                enrollmentRepository.save(enrollment);
            }
            
            // Calcular progreso basado únicamente en lecciones completadas (100%)
            // Los quizzes y prácticas no contribuyen al progreso del curso
            int totalProgressPercent = totalLessons > 0 ? (completedLessons * 100) / totalLessons : 0;
            
            return new StudentCourseDto(
                    course.getId(),
                    course.getTitle(),
                    course.getLevel(),
                    course.getDescription(),
                    totalProgressPercent,
                    enrollment.getEnrollmentDate() != null ? 
                        enrollment.getEnrollmentDate().toLocalDate() : LocalDate.now(),
                    totalProgressPercent >= 100,
                    totalLessons,
                    completedLessons,
                    enrollment.getQuizCompleted() != null ? enrollment.getQuizCompleted() : false,
                    enrollment.getQuizScore(),
                    enrollment.getBestQuizScore(),
                    enrollment.getQuizAttempts() != null ? enrollment.getQuizAttempts() : 0,
                    totalProgressPercent, // progreso de lecciones = progreso total
                    0 // progreso del quiz no contribuye al progreso del curso
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

    @Override
    public boolean startLesson(String email, Long lessonId) {
        log.info("Iniciando lección {} para estudiante: {}", lessonId, email);
        
        try {
            StudentEntity student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));
            
            LessonEntity lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lección no encontrada con id: " + lessonId));
            
            // Verificar que el estudiante esté inscrito en el curso de la lección
            List<StudentCourseEnrollmentEntity> enrollments = enrollmentRepository.findByCourse(lesson.getCourse());
            boolean isEnrolled = enrollments.stream()
                    .anyMatch(enrollment -> enrollment.getStudent().getId().equals(student.getId()));
            
            if (!isEnrolled) {
                throw new RuntimeException("El estudiante no está inscrito en este curso");
            }
            
            // Buscar o crear el progreso de la lección
            Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
            
            if (progressOpt.isPresent()) {
                StudentLessonProgressEntity progress = progressOpt.get();
                if (progress.getStatus() == LessonProgressStatus.NOT_STARTED) {
                    progress.setStatus(LessonProgressStatus.IN_PROGRESS);
                    progress.setStartDate(new java.sql.Date(System.currentTimeMillis()));
                    progressRepository.save(progress);
                    return true;
                }
                return false; // Ya está iniciada o completada
            } else {
                // Crear nuevo progreso
                StudentCourseEnrollmentEntity enrollment = enrollments.stream()
                        .filter(e -> e.getStudent().getId().equals(student.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
                
                StudentLessonProgressEntity newProgress = new StudentLessonProgressEntity(student, lesson, enrollment);
                newProgress.setStatus(LessonProgressStatus.IN_PROGRESS);
                newProgress.setStartDate(new java.sql.Date(System.currentTimeMillis()));
                progressRepository.save(newProgress);
                return true;
            }
        } catch (Exception e) {
            log.error("Error iniciando lección: {}", e.getMessage());
            throw new RuntimeException("Error iniciando lección: " + e.getMessage());
        }
    }

    @Override
    public boolean completeLessonByPractice(String email, Long lessonId, Integer score) {
        log.info("Completando lección {} por práctica para estudiante: {}", lessonId, email);
        
        try {
            StudentEntity student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));
            
            LessonEntity lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lección no encontrada con id: " + lessonId));
            
            // Buscar el progreso de la lección
            Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
            
            if (progressOpt.isPresent()) {
                StudentLessonProgressEntity progress = progressOpt.get();
                
                // Solo puede completarse si está en progreso o no iniciada
                if (progress.getStatus() == LessonProgressStatus.COMPLETED) {
                    return false; // Ya está completada
                }
                
                // Marcar como completada
                progress.setStatus(LessonProgressStatus.COMPLETED);
                progress.setCompletionDate(new java.sql.Date(System.currentTimeMillis()));
                if (progress.getStartDate() == null) {
                    progress.setStartDate(new java.sql.Date(System.currentTimeMillis()));
                }
                
                // Registrar el score de la práctica
                if (score != null) {
                    progress.setBestPracticeScore(score);
                }
                progress.setPracticeCompleted(true);
                
                progressRepository.save(progress);
                return true;
            } else {
                throw new RuntimeException("No se encontró progreso para esta lección");
            }
        } catch (Exception e) {
            log.error("Error completando lección: {}", e.getMessage());
            throw new RuntimeException("Error completando lección: " + e.getMessage());
        }
    }
    
    @Override
    public boolean completeQuiz(String email, Long courseId, Integer score) {
        log.info("Completando quiz del curso {} para estudiante: {}", courseId, email);
        
        try {
            StudentEntity student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));
            
            // Buscar la inscripción del estudiante en el curso
            List<StudentCourseEnrollmentEntity> enrollments = enrollmentRepository.findByStudent(student);
            StudentCourseEnrollmentEntity enrollment = enrollments.stream()
                    .filter(e -> e.getCourse().getId().equals(courseId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("El estudiante no está inscrito en este curso"));
            
            // Completar el quiz
            enrollment.completeQuiz(score);
            enrollmentRepository.save(enrollment);
            
            return true;
        } catch (Exception e) {
            log.error("Error completando quiz: {}", e.getMessage());
            throw new RuntimeException("Error completando quiz: " + e.getMessage());
        }
    }
    
    @Override
    public void incrementQuizAttempts(String email, Long courseId) {
        log.info("Incrementando intentos de quiz del curso {} para estudiante: {}", courseId, email);
        
        try {
            StudentEntity student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + email));
            
            // Buscar la inscripción del estudiante en el curso
            List<StudentCourseEnrollmentEntity> enrollments = enrollmentRepository.findByStudent(student);
            StudentCourseEnrollmentEntity enrollment = enrollments.stream()
                    .filter(e -> e.getCourse().getId().equals(courseId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("El estudiante no está inscrito en este curso"));
            
            // Incrementar intentos
            enrollment.incrementQuizAttempts();
            enrollmentRepository.save(enrollment);
            
        } catch (Exception e) {
            log.error("Error incrementando intentos de quiz: {}", e.getMessage());
            throw new RuntimeException("Error incrementando intentos de quiz: " + e.getMessage());
        }
    }
}
