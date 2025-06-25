package com.coders.backers.plataformapython.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;

import com.coders.backers.plataformapython.backend.enums.LessonProgressStatus;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_lesson_progress")
public class StudentLessonProgressEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private LessonEntity lesson;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private StudentCourseEnrollmentEntity enrollment;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LessonProgressStatus status;
    
    @Column(name = "start_date")
    private Date startDate;
    
    @Column(name = "completion_date")
    private Date completionDate;
    
    @Column(name = "practice_attempts")
    private Integer practiceAttempts = 0;
    
    @Column(name = "practice_completed")
    private Boolean practiceCompleted = false;
    
    @Column(name = "last_practice_score")
    private Integer lastPracticeScore;
    
    @Column(name = "best_practice_score")
    private Integer bestPracticeScore;
    
    @Column(name = "time_spent_minutes")
    private Integer timeSpentMinutes = 0;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
    
    // Constructor para nuevo progreso
    public StudentLessonProgressEntity(StudentEntity student, LessonEntity lesson, 
                                     StudentCourseEnrollmentEntity enrollment) {
        this.student = student;
        this.lesson = lesson;
        this.enrollment = enrollment;
        this.status = LessonProgressStatus.NOT_STARTED;
        this.practiceAttempts = 0;
        this.practiceCompleted = false;
        this.timeSpentMinutes = 0;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = Date.valueOf(LocalDate.now());
        updatedAt = Date.valueOf(LocalDate.now());
        if (status == null) {
            status = LessonProgressStatus.NOT_STARTED;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Date.valueOf(LocalDate.now());
    }
    
    // Método para iniciar la lección
    public void startLesson() {
        if (this.status == LessonProgressStatus.NOT_STARTED) {
            this.status = LessonProgressStatus.IN_PROGRESS;
            this.startDate = Date.valueOf(LocalDate.now());
        }
    }
    
    // Método para completar la lección
    public void completeLesson() {
        this.status = LessonProgressStatus.COMPLETED;
        this.completionDate = Date.valueOf(LocalDate.now());
        
        // Actualizar progreso del curso
        if (enrollment != null) {
            enrollment.incrementCompletedLessons();
            enrollment.setLastAccessedLessonId(lesson.getId());
        }
    }
    
    // Método para registrar un intento de práctica
    public void recordPracticeAttempt(Integer score, Boolean passed) {
        this.practiceAttempts++;
        this.lastPracticeScore = score;
        
        if (this.bestPracticeScore == null || score > this.bestPracticeScore) {
            this.bestPracticeScore = score;
        }
        
        if (passed) {
            this.practiceCompleted = true;
            // Si completa la práctica y aún no ha completado la lección, marcarla como completada
            if (this.status != LessonProgressStatus.COMPLETED) {
                completeLesson();
            }
        }
    }
    
    // Método para agregar tiempo de estudio
    public void addStudyTime(Integer minutes) {
        this.timeSpentMinutes += minutes;
    }
}
