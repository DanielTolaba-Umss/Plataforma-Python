package com.coders.backers.plataformapython.backend.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PracticeEntity practice;

    @OneToMany(mappedBy = "leccion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ContenidoModel> contenidos = new ArrayList<>();

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<StudentLessonProgressEntity> studentProgress = new ArrayList<>();

    public LessonEntity(String title, String description, CourseEntity course) {
        this.title = title;
        this.description = description;
        this.course = course;
    }

    public LessonEntity(Long id, String title, String description, boolean active,
            Date createdAt, Date updatedAt, CourseEntity course) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.course = course;
    }

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