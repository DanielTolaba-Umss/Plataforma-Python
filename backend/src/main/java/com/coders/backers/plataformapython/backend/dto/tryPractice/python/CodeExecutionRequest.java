package com.coders.backers.plataformapython.backend.dto.tryPractice.python;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionRequest {
    private String code;
    private Long studentId;
    private Long practiceId;
}
