package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.services.TryPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/try-practices")
@RequiredArgsConstructor
public class TryPracticeController {

    private final TryPracticeService tryPracticeService;

    @PostMapping
    public ResponseEntity<TryPracticeDto> create(@RequestBody CodeExecutionRequest code) {
        return ResponseEntity.ok(tryPracticeService.createTryPractice(code));
    }

    @GetMapping
    public ResponseEntity<List<TryPracticeDto>> getAll() {
        return ResponseEntity.ok(tryPracticeService.getAllTryPractices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TryPracticeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tryPracticeService.getTryPracticeById(id));
    }

    @GetMapping("/by-estudiante/{studentId}")
    public ResponseEntity<List<TryPracticeDto>> getByEstudianteProgreso(@PathVariable Long studentId) {
        return ResponseEntity.ok(tryPracticeService.getByEstudianteId(studentId));
    }

    @GetMapping("/by-practice/{practiceId}")
    public ResponseEntity<List<TryPracticeDto>> getByPractice(@PathVariable Long practiceId) {
        return ResponseEntity.ok(tryPracticeService.getByPracticeId(practiceId));
    }
}
