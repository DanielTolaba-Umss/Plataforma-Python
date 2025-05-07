package com.coders.backers.plataformapython.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;

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
