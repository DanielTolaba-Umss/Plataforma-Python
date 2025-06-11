package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionResult;

public interface PythonExecutionService {
    CodeExecutionResult executeCode(CodeExecutionRequest request);
}
