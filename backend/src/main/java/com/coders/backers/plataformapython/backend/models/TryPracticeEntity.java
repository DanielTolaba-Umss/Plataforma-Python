package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;

@Entity
@Table(name = "try_practice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TryPracticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practice_id", nullable = false)
    private PracticeEntity practice;

    @Column(name = "code", columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(name = "test_results", columnDefinition = "TEXT")
    private Boolean [] testResults;

    @Column(name = "approved", nullable = false)
    private Boolean approved = false;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createAt;

    public TryPracticeEntity(String code, StudentEntity student, PracticeEntity practice) {
        this.code = code;
        this.student = student;
        this.practice = practice;
    }
}
