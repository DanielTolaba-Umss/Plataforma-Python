package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.models.StudentLessonProgressEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.enums.LessonProgressStatus;
import com.coders.backers.plataformapython.backend.repositories.StudentLessonProgressRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProgressService {

    @Autowired
    private StudentLessonProgressRepository progressRepository;
    
    @Autowired
    private LessonRepository lessonRepository;

    /**
     * Inicializa el progreso de un estudiante para todas las lecciones de un curso
     */
    public void initializeCourseProgress(StudentEntity student, CourseEntity course, StudentCourseEnrollmentEntity enrollment) {
        List<LessonEntity> courseLessons = lessonRepository.findByCourseId(course.getId());
        
        for (LessonEntity lesson : courseLessons) {
            // Solo crear progreso si no existe ya
            if (!progressRepository.existsByStudentAndLesson(student, lesson)) {
                StudentLessonProgressEntity progress = new StudentLessonProgressEntity(student, lesson, enrollment);
                progressRepository.save(progress);
            }
        }
    }

    /**
     * Inicializa el progreso para una lección específica si no existe
     */
    public StudentLessonProgressEntity initializeLessonProgress(StudentEntity student, LessonEntity lesson, StudentCourseEnrollmentEntity enrollment) {
        Optional<StudentLessonProgressEntity> existingProgress = 
            progressRepository.findByStudentAndLesson(student, lesson);
            
        if (existingProgress.isPresent()) {
            return existingProgress.get();
        }
        
        StudentLessonProgressEntity progress = new StudentLessonProgressEntity(student, lesson, enrollment);
        return progressRepository.save(progress);
    }

    /**
     * Inicia una lección (marca como en progreso)
     */
    public StudentLessonProgressEntity startLesson(StudentEntity student, LessonEntity lesson) {
        Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
        
        if (progressOpt.isPresent()) {
            StudentLessonProgressEntity progress = progressOpt.get();
            progress.startLesson();
            return progressRepository.save(progress);
        }
        
        throw new RuntimeException("No se encontró progreso inicializado para esta lección");
    }

    /**
     * Marca una lección como completada
     */
    public StudentLessonProgressEntity completeLesson(StudentEntity student, LessonEntity lesson) {
        Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
        
        if (progressOpt.isPresent()) {
            StudentLessonProgressEntity progress = progressOpt.get();
            progress.completeLesson();
            return progressRepository.save(progress);
        }
        
        throw new RuntimeException("No se encontró progreso inicializado para esta lección");
    }

    /**
     * Registra un intento de práctica
     */
    public StudentLessonProgressEntity recordPracticeAttempt(StudentEntity student, LessonEntity lesson, Integer score, Boolean passed) {
        Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
        
        if (progressOpt.isPresent()) {
            StudentLessonProgressEntity progress = progressOpt.get();
            progress.recordPracticeAttempt(score, passed);
            return progressRepository.save(progress);
        }
        
        throw new RuntimeException("No se encontró progreso inicializado para esta lección");
    }

    /**
     * Añade tiempo de estudio a una lección
     */
    public StudentLessonProgressEntity addStudyTime(StudentEntity student, LessonEntity lesson, Integer minutes) {
        Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
        
        if (progressOpt.isPresent()) {
            StudentLessonProgressEntity progress = progressOpt.get();
            progress.addStudyTime(minutes);
            return progressRepository.save(progress);
        }
        
        throw new RuntimeException("No se encontró progreso inicializado para esta lección");
    }

    /**
     * Obtiene el progreso de un estudiante para una lección específica
     */
    public Optional<StudentLessonProgressEntity> getProgress(StudentEntity student, LessonEntity lesson) {
        return progressRepository.findByStudentAndLesson(student, lesson);
    }

    /**
     * Obtiene todo el progreso de un estudiante
     */
    public List<StudentLessonProgressEntity> getStudentProgress(StudentEntity student) {
        return progressRepository.findByStudent(student);
    }

    /**
     * Obtiene el progreso de un estudiante en un curso específico
     */
    public List<StudentLessonProgressEntity> getStudentProgressByCourse(StudentEntity student, Long courseId) {
        return progressRepository.findByStudentAndCourseId(student, courseId);
    }

    /**
     * Calcula el porcentaje de progreso total de un estudiante en un curso
     */
    public double getCourseProgressPercentage(StudentEntity student, Long courseId) {
        List<StudentLessonProgressEntity> courseProgress = getStudentProgressByCourse(student, courseId);
        
        if (courseProgress.isEmpty()) {
            return 0.0;
        }
        
        long completedLessons = progressRepository.countCompletedLessonsByCourse(student, courseId);
        return (double) completedLessons / courseProgress.size() * 100.0;
    }

    /**
     * Obtiene las lecciones completadas por un estudiante
     */
    public List<StudentLessonProgressEntity> getCompletedLessons(StudentEntity student) {
        return progressRepository.findCompletedLessonsByStudent(student);
    }

    /**
     * Obtiene las lecciones en progreso por un estudiante
     */
    public List<StudentLessonProgressEntity> getInProgressLessons(StudentEntity student) {
        return progressRepository.findInProgressLessonsByStudent(student);
    }

    /**
     * Reinicia el progreso de una lección (útil para rehacer lecciones)
     */
    public StudentLessonProgressEntity resetLessonProgress(StudentEntity student, LessonEntity lesson) {
        Optional<StudentLessonProgressEntity> progressOpt = progressRepository.findByStudentAndLesson(student, lesson);
        
        if (progressOpt.isPresent()) {
            StudentLessonProgressEntity progress = progressOpt.get();
            progress.setStatus(LessonProgressStatus.NOT_STARTED);
            progress.setStartDate(null);
            progress.setCompletionDate(null);
            progress.setPracticeAttempts(0);
            progress.setPracticeCompleted(false);
            progress.setLastPracticeScore(null);
            progress.setBestPracticeScore(null);
            progress.setTimeSpentMinutes(0);
            
            return progressRepository.save(progress);
        }
        
        throw new RuntimeException("No se encontró progreso para esta lección");
    }

    /**
     * Obtiene estadísticas de progreso para un estudiante
     */
    public ProgressStats getProgressStats(StudentEntity student) {
        List<StudentLessonProgressEntity> allProgress = getStudentProgress(student);
        
        long completedLessons = allProgress.stream()
            .filter(p -> p.getStatus() == LessonProgressStatus.COMPLETED)
            .count();
            
        long inProgressLessons = allProgress.stream()
            .filter(p -> p.getStatus() == LessonProgressStatus.IN_PROGRESS)
            .count();
            
        Integer totalStudyTime = allProgress.stream()
            .mapToInt(p -> p.getTimeSpentMinutes() != null ? p.getTimeSpentMinutes() : 0)
            .sum();
            
        return new ProgressStats(allProgress.size(), (int) completedLessons, (int) inProgressLessons, totalStudyTime);
    }

    /**
     * Clase interna para estadísticas de progreso
     */
    public static class ProgressStats {
        private final int totalLessons;
        private final int completedLessons;
        private final int inProgressLessons;
        private final int totalStudyTimeMinutes;
        
        public ProgressStats(int totalLessons, int completedLessons, int inProgressLessons, int totalStudyTimeMinutes) {
            this.totalLessons = totalLessons;
            this.completedLessons = completedLessons;
            this.inProgressLessons = inProgressLessons;
            this.totalStudyTimeMinutes = totalStudyTimeMinutes;
        }
        
        public int getTotalLessons() { return totalLessons; }
        public int getCompletedLessons() { return completedLessons; }
        public int getInProgressLessons() { return inProgressLessons; }
        public int getTotalStudyTimeMinutes() { return totalStudyTimeMinutes; }
        public double getCompletionPercentage() { 
            return totalLessons > 0 ? (double) completedLessons / totalLessons * 100.0 : 0.0; 
        }
    }
}
