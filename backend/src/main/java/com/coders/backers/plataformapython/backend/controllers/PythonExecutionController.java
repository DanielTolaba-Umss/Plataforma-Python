package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.dto.python.CodeExecutionResult;
import com.coders.backers.plataformapython.backend.services.PythonExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/python")
@RequiredArgsConstructor
public class PythonExecutionController {

    private final PythonExecutionService pythonExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResult> executeCode(@RequestBody CodeExecutionRequest request) {
        CodeExecutionResult result = pythonExecutionService.executeCode(request);
        return ResponseEntity.ok(result);
    }
}
