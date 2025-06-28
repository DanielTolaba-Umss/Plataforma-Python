package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.testcase.*;
import com.coders.backers.plataformapython.backend.services.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestCaseService testCaseService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TestCaseDto> create(@RequestBody CreateTestCaseDto dto) {
        return ResponseEntity.status(201).body(testCaseService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TestCaseDto> update(@PathVariable Long id, @RequestBody UpdateTestCaseDto dto) {
        return ResponseEntity.ok(testCaseService.update(id, dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TestCaseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(testCaseService.getById(id));
    }

    @GetMapping("/by-practice/{practiceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<TestCaseDto>> getByPractice(@PathVariable Long practiceId) {
        return ResponseEntity.ok(testCaseService.getByPractice(practiceId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        testCaseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
