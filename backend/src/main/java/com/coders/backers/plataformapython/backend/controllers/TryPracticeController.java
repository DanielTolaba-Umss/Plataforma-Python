package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.services.TryPracticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/try-practices")
@RequiredArgsConstructor
@Slf4j
public class TryPracticeController {

    private final TryPracticeService tryPracticeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TryPracticeDto> create(@RequestBody CodeExecutionRequest code) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("POST /api/try-practices - Usuario: {}, Roles: {}, Práctica ID: {}", 
                auth.getName(), auth.getAuthorities(), code.getPracticeId());
        return ResponseEntity.ok(tryPracticeService.createTryPractice(code));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<TryPracticeDto>> getAll() {
        return ResponseEntity.ok(tryPracticeService.getAllTryPractices());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TryPracticeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tryPracticeService.getTryPracticeById(id));
    }

    @GetMapping("/by-estudiante/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<TryPracticeDto>> getByEstudianteProgreso(@PathVariable Long studentId) {
        return ResponseEntity.ok(tryPracticeService.getByStudentId(studentId));
    }

    @GetMapping("/by-practice/{practiceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<TryPracticeDto>> getByPractice(@PathVariable Long practiceId) {
        return ResponseEntity.ok(tryPracticeService.getByPracticeId(practiceId));
    }

    @GetMapping("/by-estudiante/{studentId}/by-practice/{practiceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<TryPracticeDto>> getByEstudianteAndPractice(@PathVariable Long studentId,
            @PathVariable Long practiceId) {
        return ResponseEntity.ok(tryPracticeService.getByStudentIdAndPracticeId(studentId, practiceId));
    }

    @PutMapping("/{id}/feedback")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TryPracticeDto> updateFeedback(@PathVariable Long id, @RequestBody String feedback) {
        return ResponseEntity.ok(tryPracticeService.updateTryPracticeByFeedback(id, feedback));
    }
}
