package com.coders.backers.plataformapython.backend.dto.python;

import lombok.Data;

@Data
public class CodeExecutionRequest {
    private String code;
    private Long studentId;
    private Long practiceId;
}
