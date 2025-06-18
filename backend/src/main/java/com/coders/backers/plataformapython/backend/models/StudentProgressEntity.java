package com.coders.backers.plataformapython.backend.models;

import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "student_progress")
public class StudentProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private CourseEntity course;

    @Column(name = "completed_modules")
    private int completedModules;

    @Column(name = "total_modules")
    private int totalModules;

    @Column(name = "completion_percentage")
    private double completionPercentage;

    @Column(name = "completion_date")
    private LocalDate completionDate;
}
