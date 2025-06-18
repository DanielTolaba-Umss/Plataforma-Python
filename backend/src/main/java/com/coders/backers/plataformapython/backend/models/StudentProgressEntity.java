package com.coders.backers.plataformapython.backend.models;

import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "student_progress")
public class StudentProgressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    private LessonEntity lesson;

    private int porcentaje;

    private LocalDate fechaFinalizacion;
}