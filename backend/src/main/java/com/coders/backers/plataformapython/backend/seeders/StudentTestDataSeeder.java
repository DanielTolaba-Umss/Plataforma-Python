package com.coders.backers.plataformapython.backend.seeders;

import com.coders.backers.plataformapython.backend.enums.EnrollmentStatus;
import com.coders.backers.plataformapython.backend.enums.LessonProgressStatus;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.models.StudentLessonProgressEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.repositories.StudentCourseEnrollmentRepository;
import com.coders.backers.plataformapython.backend.repositories.StudentLessonProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class StudentTestDataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final StudentCourseEnrollmentRepository enrollmentRepository;
    private final StudentLessonProgressRepository progressRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createTestStudent();
        createTestCourses();
        createTestEnrollments();
        createTestProgress();
    }    private void createTestStudent() {
        if (studentRepository.findByEmail("estudiante@test.com").isEmpty()) {
            StudentEntity student = new StudentEntity();
            student.setName("María");
            student.setLastName("González");
            student.setEmail("estudiante@test.com");
            student.setPhone("123456789");
            student.setPassword(passwordEncoder.encode("123456789"));
            student.setRole("STUDENT");
            student.setActive(true);
            student.setEmailVerified(true);
            
            studentRepository.save(student);
            log.info("✅ Estudiante de prueba creado: estudiante@test.com / 123456789");
        } else {
            log.info("ℹ️ Estudiante de prueba ya existe");
        }
    }

    private void createTestCourses() {
        // Curso Básico
        if (!courseRepository.existsByTitle("Python Básico")) {
            CourseEntity basicCourse = new CourseEntity();
            basicCourse.setTitle("Python Básico");
            basicCourse.setDescription("Introducción a la programación con Python");
            basicCourse.setLevel("Básico");
            basicCourse.setActive(true);
            courseRepository.save(basicCourse);

            // Lecciones del curso básico
            createLesson(basicCourse, "Introducción a Python", "Conceptos básicos de Python", 1);
            createLesson(basicCourse, "Variables y Tipos de Datos", "Aprende sobre variables", 2);
            createLesson(basicCourse, "Estructuras de Control", "Condicionales y bucles", 3);
            
            log.info("✅ Curso Python Básico creado con lecciones");
        }

        // Curso Intermedio
        if (!courseRepository.existsByTitle("Python Intermedio")) {
            CourseEntity intermediateCourse = new CourseEntity();
            intermediateCourse.setTitle("Python Intermedio");
            intermediateCourse.setDescription("Programación orientada a objetos y estructuras de datos");
            intermediateCourse.setLevel("Intermedio");
            intermediateCourse.setActive(true);
            courseRepository.save(intermediateCourse);

            // Lecciones del curso intermedio
            createLesson(intermediateCourse, "Programación Orientada a Objetos", "Clases y objetos", 1);
            createLesson(intermediateCourse, "Herencia y Polimorfismo", "Conceptos avanzados de POO", 2);
            createLesson(intermediateCourse, "Manejo de Excepciones", "Try, catch y finally", 3);
            createLesson(intermediateCourse, "Estructuras de Datos", "Listas, diccionarios y tuplas", 4);
            
            log.info("✅ Curso Python Intermedio creado con lecciones");
        }

        // Curso Avanzado
        if (!courseRepository.existsByTitle("Python Avanzado")) {
            CourseEntity advancedCourse = new CourseEntity();
            advancedCourse.setTitle("Python Avanzado");
            advancedCourse.setDescription("Programación avanzada, frameworks y librerías");
            advancedCourse.setLevel("Avanzado");
            advancedCourse.setActive(true);
            courseRepository.save(advancedCourse);

            // Lecciones del curso avanzado
            createLesson(advancedCourse, "Decoradores y Generadores", "Conceptos avanzados", 1);
            createLesson(advancedCourse, "Programación Funcional", "Lambda, map, filter", 2);
            createLesson(advancedCourse, "Frameworks Web", "Flask y Django", 3);
            createLesson(advancedCourse, "APIs y Microservicios", "REST APIs con Python", 4);
            createLesson(advancedCourse, "Machine Learning", "Introducción a ML con Python", 5);
            
            log.info("✅ Curso Python Avanzado creado con lecciones");
        }
    }

    private void createLesson(CourseEntity course, String title, String description, int order) {
        if (!lessonRepository.existsByTitleAndCourseId(title, course.getId())) {
            LessonEntity lesson = new LessonEntity();
            lesson.setTitle(title);
            lesson.setDescription(description);
            lesson.setCourse(course);
            lesson.setActive(true);
            lessonRepository.save(lesson);
        }
    }    private void createTestEnrollments() {
        StudentEntity student = studentRepository.findByEmail("estudiante@test.com").orElse(null);
        if (student == null) return;

        // Inscripción al curso básico
        List<CourseEntity> basicCourses = courseRepository.findByTitle("Python Básico");
        CourseEntity basicCourse = basicCourses.isEmpty() ? null : basicCourses.get(0);
        if (basicCourse != null && !enrollmentRepository.existsByStudentAndCourse(student, basicCourse)) {
            StudentCourseEnrollmentEntity enrollment = new StudentCourseEnrollmentEntity();
            enrollment.setStudent(student);
            enrollment.setCourse(basicCourse);
            enrollment.setEnrollmentDate(Date.valueOf(LocalDate.now().minusDays(30)));
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
            enrollmentRepository.save(enrollment);
            log.info("✅ Inscripción creada: Estudiante -> Python Básico");
        }

        // Inscripción al curso intermedio
        List<CourseEntity> intermediateCourses = courseRepository.findByTitle("Python Intermedio");
        CourseEntity intermediateCourse = intermediateCourses.isEmpty() ? null : intermediateCourses.get(0);
        if (intermediateCourse != null && !enrollmentRepository.existsByStudentAndCourse(student, intermediateCourse)) {
            StudentCourseEnrollmentEntity enrollment = new StudentCourseEnrollmentEntity();
            enrollment.setStudent(student);
            enrollment.setCourse(intermediateCourse);
            enrollment.setEnrollmentDate(Date.valueOf(LocalDate.now().minusDays(15)));
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
            enrollmentRepository.save(enrollment);
            log.info("✅ Inscripción creada: Estudiante -> Python Intermedio");
        }
    }    private void createTestProgress() {
        StudentEntity student = studentRepository.findByEmail("estudiante@test.com").orElse(null);
        if (student == null) return;

        List<CourseEntity> basicCourses = courseRepository.findByTitle("Python Básico");
        CourseEntity basicCourse = basicCourses.isEmpty() ? null : basicCourses.get(0);
        if (basicCourse != null) {
            List<LessonEntity> basicLessons = lessonRepository.findByCourseIdAndActive(basicCourse.getId(), true);
            StudentCourseEnrollmentEntity enrollment = enrollmentRepository.findByStudentAndCourse(student, basicCourse).orElse(null);
            
            if (enrollment != null) {
                // Completar las primeras 2 lecciones del curso básico
                for (int i = 0; i < Math.min(2, basicLessons.size()); i++) {
                    LessonEntity lesson = basicLessons.get(i);
                    if (!progressRepository.existsByStudentAndLesson(student, lesson)) {
                        StudentLessonProgressEntity progress = new StudentLessonProgressEntity();
                        progress.setStudent(student);
                        progress.setLesson(lesson);
                        progress.setEnrollment(enrollment);
                        progress.setStatus(LessonProgressStatus.COMPLETED);
                        progress.setStartDate(Date.valueOf(LocalDate.now().minusDays(25 - i * 5)));
                        progress.setCompletionDate(Date.valueOf(LocalDate.now().minusDays(23 - i * 5)));
                        progressRepository.save(progress);
                    }
                }

                // Iniciar la tercera lección
                if (basicLessons.size() > 2) {
                    LessonEntity lesson = basicLessons.get(2);
                    if (!progressRepository.existsByStudentAndLesson(student, lesson)) {
                        StudentLessonProgressEntity progress = new StudentLessonProgressEntity();
                        progress.setStudent(student);
                        progress.setLesson(lesson);
                        progress.setEnrollment(enrollment);
                        progress.setStatus(LessonProgressStatus.IN_PROGRESS);
                        progress.setStartDate(Date.valueOf(LocalDate.now().minusDays(10)));
                        progressRepository.save(progress);
                    }
                }
                
                log.info("✅ Progreso de lecciones creado para curso básico");
            }
        }

        List<CourseEntity> intermediateCourses = courseRepository.findByTitle("Python Intermedio");
        CourseEntity intermediateCourse = intermediateCourses.isEmpty() ? null : intermediateCourses.get(0);
        if (intermediateCourse != null) {
            List<LessonEntity> intermediateLessons = lessonRepository.findByCourseIdAndActive(intermediateCourse.getId(), true);
            StudentCourseEnrollmentEntity enrollment = enrollmentRepository.findByStudentAndCourse(student, intermediateCourse).orElse(null);
            
            if (enrollment != null && !intermediateLessons.isEmpty()) {
                // Completar solo la primera lección del curso intermedio
                LessonEntity lesson = intermediateLessons.get(0);
                if (!progressRepository.existsByStudentAndLesson(student, lesson)) {
                    StudentLessonProgressEntity progress = new StudentLessonProgressEntity();
                    progress.setStudent(student);
                    progress.setLesson(lesson);
                    progress.setEnrollment(enrollment);
                    progress.setStatus(LessonProgressStatus.COMPLETED);
                    progress.setStartDate(Date.valueOf(LocalDate.now().minusDays(10)));
                    progress.setCompletionDate(Date.valueOf(LocalDate.now().minusDays(8)));
                    progressRepository.save(progress);
                }
                
                log.info("✅ Progreso de lecciones creado para curso intermedio");
            }
        }
    }
}
