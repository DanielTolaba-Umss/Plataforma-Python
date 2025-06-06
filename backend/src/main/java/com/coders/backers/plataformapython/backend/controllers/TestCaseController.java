package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.testcase.*;
import com.coders.backers.plataformapython.backend.services.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestCaseService testCaseService;

    @PostMapping
    public ResponseEntity<TestCaseDto> create(@RequestBody CreateTestCaseDto dto) {
        return ResponseEntity.status(201).body(testCaseService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestCaseDto> update(@PathVariable Long id, @RequestBody UpdateTestCaseDto dto) {
        return ResponseEntity.ok(testCaseService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestCaseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(testCaseService.getById(id));
    }

    @GetMapping("/by-practice/{practiceId}")
    public ResponseEntity<List<TestCaseDto>> getByPractice(@PathVariable Long practiceId) {
        return ResponseEntity.ok(testCaseService.getByPractice(practiceId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        testCaseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
