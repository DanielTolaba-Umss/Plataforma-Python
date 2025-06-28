package com.coders.backers.plataformapython.backend.dto.tryPractice.python;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResult {
    private boolean success;
    private String output;
    private String error;
}
