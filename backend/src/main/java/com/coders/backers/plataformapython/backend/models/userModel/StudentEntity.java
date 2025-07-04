package com.coders.backers.plataformapython.backend.models.userModel;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import com.coders.backers.plataformapython.backend.enums.Role;
import com.coders.backers.plataformapython.backend.models.CourseEntity;

@Getter
@Setter
@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "user_id")
public class StudentEntity extends UserEntity {
    @Column(name = "current_level")
    private String currentLevel;
    
    @Column(name = "enrollment_date")
    private Date enrollmentDate;
    
    @Column(name = "created_at")
    private Date createdAt;    @Column(name = "updated_at")
    private Date updatedAt;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<CourseEntity> courses = new HashSet<>();
    
    
    public StudentEntity() {
        setRole(Role.STUDENT.name());
    }
    
    public StudentEntity(String currentLevel) {
        setRole(Role.STUDENT.name());
        this.currentLevel = currentLevel;
        this.enrollmentDate = Date.valueOf(LocalDate.now());
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = Date.valueOf(LocalDate.now());
        updatedAt = Date.valueOf(LocalDate.now());
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Date.valueOf(LocalDate.now());
    }
    
}
