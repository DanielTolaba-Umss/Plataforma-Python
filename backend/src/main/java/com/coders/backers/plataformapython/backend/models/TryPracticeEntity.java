package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

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

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "practice_id", nullable = false)
    private Long practiceId;

    private String code;

    @Column(name = "test_results", columnDefinition = "TEXT")
    private Boolean [] testResults;

    private boolean approved;

    private String feedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createAt;

    public TryPracticeEntity(String code, Long studentId, Long practiceId) {
        this.code = code;
        this.studentId = studentId;
        this.practiceId = practiceId;
    }
}
