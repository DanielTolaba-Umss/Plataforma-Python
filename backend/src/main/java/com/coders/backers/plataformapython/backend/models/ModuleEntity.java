package com.coders.backers.plataformapython.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Set;

import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;

import java.util.HashSet;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "module")
public class ModuleEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String title;
    private String description;
    private int orden;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    private boolean active;


    public ModuleEntity(String title, String description, int orden) {
        this.title = title;
        this.description = description;
        this.orden = orden;
    }

    public ModuleEntity(Long id, String title, String description, int orden, Date createdAt, Date updatedAt,
    boolean active) {
        this.id = id;
        this.title = title;
        this.description = description;
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
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "teacher_module",
        joinColumns = @JoinColumn(name = "module_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<TeacherEntity> teachers = new HashSet<>();

}
