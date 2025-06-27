package com.coders.backers.plataformapython.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;

import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;

import java.util.HashSet;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "curso")
public class CourseEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "curso_id")
    private Long id;

    @Column(name = "titulo")
    private String title;
    
    @Column(name = "descripcion")
    private String description;
    
    @Column(name = "nivel")
    private String level;
    
    @Column(name = "orden")
    private int orden;

    @Column(name = "fecha_creacion")
    private Date createdAt;

    @Column(name = "fecha_actualizacion")
    private Date updatedAt;

    @Column(name = "activo")
    private boolean active;

    // Constructor para crear un nuevo curso
    public CourseEntity(String title, String description, String level, int orden) {
        this.title = title;
        this.description = description;
        this.level = level;
        this.orden = orden;
    }

    // Constructor completo para fines de mapeo
    public CourseEntity(Long id, String title, String description, String level, int orden, 
                        Date createdAt, Date updatedAt, boolean active) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.level = level;
        this.orden = orden;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.active = active;
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
    }    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "teacher_course",
        joinColumns = @JoinColumn(name = "curso_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<TeacherEntity> teachers = new HashSet<>();
    
    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    private Set<StudentEntity> students = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LessonEntity> lessons = new ArrayList<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<StudentCourseEnrollmentEntity> enrollments = new ArrayList<>();
}