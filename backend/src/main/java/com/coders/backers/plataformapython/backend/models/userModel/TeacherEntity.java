package com.coders.backers.plataformapython.backend.models.userModel;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import com.coders.backers.plataformapython.backend.enums.Role;

import com.coders.backers.plataformapython.backend.models.ModuleEntity;

import jakarta.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "teachers")
@PrimaryKeyJoinColumn(name = "user_id")
public class TeacherEntity extends UserEntity {

    @Column(name = "specialty")
    private String specialty;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "teacher_module",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    private Set<ModuleEntity> modules = new HashSet<>();
    
    
    public TeacherEntity(String specialty) {
        this.specialty = specialty;
    }

    @Override
    @PrePersist
    protected void onCreate() {
        super.onCreate(); 
    }
    
}
