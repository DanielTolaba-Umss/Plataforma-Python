package com.coders.backers.plataformapython.backend.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "leccion")
public class LessonEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "leccion_id")
    private Long id;

    @Column(name = "titulo")
    private String title;
    
    @Column(name = "descripcion")
    private String description;
    
    @Column(name = "active")
    private boolean active;
    
    @Column(name = "create_at")
    private Date createdAt;

    @Column(name = "update_at")
    private Date updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private CourseEntity course;
    
    @Column(name = "quiz_id")
    private Long quizId;
    
    @Column(name = "practica_id")
    private Long practiceId;

    // Constructor para crear una nueva lección
    public LessonEntity(String title, String description, CourseEntity course) {
        this.title = title;
        this.description = description;
        this.course = course;
    }

    // Constructor completo para fines de mapeo
    public LessonEntity(Long id, String title, String description, boolean active, 
                       Date createdAt, Date updatedAt, CourseEntity course, 
                       Long quizId, Long practiceId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.course = course;
        this.quizId = quizId;
        this.practiceId = practiceId;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = Date.valueOf(LocalDate.now());
        updatedAt = Date.valueOf(LocalDate.now());
        active = true; 
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Date.valueOf(LocalDate.now());
    }
}