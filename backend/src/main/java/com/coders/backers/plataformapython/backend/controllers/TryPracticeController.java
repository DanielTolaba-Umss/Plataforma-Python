package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
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
    public ResponseEntity<TryPracticeDto> create(@RequestBody CreateTryPracticeDto dto) {
        return ResponseEntity.ok(tryPracticeService.createTryPractice(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TryPracticeDto> update(@PathVariable Long id, @RequestBody UpdateTryPracticeDto dto) {
        return ResponseEntity.ok(tryPracticeService.updateTryPractice(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<TryPracticeDto>> getAll() {
        return ResponseEntity.ok(tryPracticeService.getAllTryPractices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TryPracticeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tryPracticeService.getTryPracticeById(id));
    }

    @GetMapping("/by-practice/{practiceId}")
    public ResponseEntity<List<TryPracticeDto>> getByPractice(@PathVariable Long practiceId) {
        return ResponseEntity.ok(tryPracticeService.getByPracticeId(practiceId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tryPracticeService.deleteTryPractice(id);
        return ResponseEntity.noContent().build();
    }
}
