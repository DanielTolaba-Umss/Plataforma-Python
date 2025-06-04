package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.dto.python.CodeExecutionResult;

public interface PythonExecutionService {
    CodeExecutionResult executeCode(CodeExecutionRequest request);
}
