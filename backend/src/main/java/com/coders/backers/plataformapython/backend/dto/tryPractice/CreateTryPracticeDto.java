package com.coders.backers.plataformapython.backend.dto.tryPractice;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTryPracticeDto {

    private Long studentId;
    private Long practiceId;
    private String code;
    private Boolean [] testResults;
    private boolean approved;
    private String feedback;
    private LocalDateTime createAt;
}

