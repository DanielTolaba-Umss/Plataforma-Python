package com.coders.backers.plataformapython.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;

import com.coders.backers.plataformapython.backend.enums.EnrollmentStatus;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_course_enrollment")
public class StudentCourseEnrollmentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private CourseEntity course;
    
    @Column(name = "enrollment_date", nullable = false)
    private Date enrollmentDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EnrollmentStatus status;
    
    @Column(name = "completion_date")
    private Date completionDate;
    
    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage = 0;
    
    @Column(name = "last_accessed_lesson_id")
    private Long lastAccessedLessonId;
    
    @Column(name = "total_lessons")
    private Integer totalLessons = 0;
    
    @Column(name = "completed_lessons")
    private Integer completedLessons = 0;
    
    @Column(name = "quiz_completed", nullable = false)
    private Boolean quizCompleted = false;
    
    @Column(name = "quiz_score")
    private Integer quizScore;
    
    @Column(name = "quiz_attempts")
    private Integer quizAttempts = 0;
    
    @Column(name = "best_quiz_score")
    private Integer bestQuizScore;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
    
    // Constructor para nueva inscripción
    public StudentCourseEnrollmentEntity(StudentEntity student, CourseEntity course) {
        this.student = student;
        this.course = course;
        this.enrollmentDate = Date.valueOf(LocalDate.now());
        this.status = EnrollmentStatus.ACTIVE;
        this.progressPercentage = 0;
        this.completedLessons = 0;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = Date.valueOf(LocalDate.now());
        updatedAt = Date.valueOf(LocalDate.now());
        if (enrollmentDate == null) {
            enrollmentDate = Date.valueOf(LocalDate.now());
        }
        if (status == null) {
            status = EnrollmentStatus.ACTIVE;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Date.valueOf(LocalDate.now());
        
        // Calcular progreso con 50% lecciones y 50% quiz
        int lessonProgress = 0;
        int quizProgress = 0;
        
        // Progreso de lecciones (50% del total)
        if (totalLessons > 0) {
            lessonProgress = (completedLessons * 50) / totalLessons;
        }
        
        // Progreso del quiz (50% del total)
        if (quizCompleted != null && quizCompleted) {
            quizProgress = 50; // Si completó el quiz, obtiene el 50%
        }
        
        // Progreso total = progreso lecciones + progreso quiz
        progressPercentage = lessonProgress + quizProgress;
        
        // Marcar como completado si llegó al 100% (lecciones completadas Y quiz completado)
        if (progressPercentage >= 100 && status == EnrollmentStatus.ACTIVE) {
            status = EnrollmentStatus.COMPLETED;
            completionDate = Date.valueOf(LocalDate.now());
        }
    }
    
    // Método helper para incrementar lecciones completadas
    public void incrementCompletedLessons() {
        this.completedLessons++;
        onUpdate(); // Recalcular progreso
    }
    
    // Método helper para decrementar lecciones completadas
    public void decrementCompletedLessons() {
        if (this.completedLessons > 0) {
            this.completedLessons--;
            onUpdate(); // Recalcular progreso
        }
    }
    
    // Método helper para completar el quiz
    public void completeQuiz(Integer score) {
        this.quizCompleted = true;
        this.quizScore = score;
        this.quizAttempts = (this.quizAttempts != null ? this.quizAttempts : 0) + 1;
        
        // Actualizar mejor puntuación
        if (this.bestQuizScore == null || (score != null && score > this.bestQuizScore)) {
            this.bestQuizScore = score;
        }
        
        onUpdate(); // Recalcular progreso
    }
    
    // Método helper para incrementar intentos de quiz
    public void incrementQuizAttempts() {
        this.quizAttempts = (this.quizAttempts != null ? this.quizAttempts : 0) + 1;
    }
    
    // Método para calcular progreso manual (sin triggers automáticos)
    public int calculateProgress() {
        int lessonProgress = 0;
        int quizProgress = 0;
        
        // Progreso de lecciones (50% del total)
        if (totalLessons != null && totalLessons > 0) {
            lessonProgress = (completedLessons * 50) / totalLessons;
        }
        
        // Progreso del quiz (50% del total)
        if (quizCompleted != null && quizCompleted) {
            quizProgress = 50; // Si completó el quiz, obtiene el 50%
        }
        
        return lessonProgress + quizProgress;
    }
}
