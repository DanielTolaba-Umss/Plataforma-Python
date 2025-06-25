package com.coders.backers.plataformapython.backend.models.userModel;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import com.coders.backers.plataformapython.backend.models.CourseEntity;

import jakarta.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "teachers")
@PrimaryKeyJoinColumn(name = "user_id")
public class TeacherEntity extends UserEntity {    @Column(name = "specialty")
    private String specialty;
    
    @ManyToMany(mappedBy = "teachers", fetch = FetchType.LAZY)
    private Set<CourseEntity> courses = new HashSet<>();

    public TeacherEntity(String specialty) {
        this.specialty = specialty;
    }

    @Override
    @PrePersist
    protected void onCreate() {
        super.onCreate();
    }
}
