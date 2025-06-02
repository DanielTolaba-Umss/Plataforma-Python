package com.coders.backers.plataformapython.backend.dto.tryPractice;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TryPracticeDto {
    private Long id;
    private Long studentId;
    private Long practiceId;
    private String code;
    private Boolean [] testResults;
    private boolean approved;
    private String feedback;
    private Date createAt;
}
