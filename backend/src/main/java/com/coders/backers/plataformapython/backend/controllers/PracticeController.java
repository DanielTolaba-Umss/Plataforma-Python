package com.coders.backers.plataformapython.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.coders.backers.plataformapython.backend.dto.practice.*;
import com.coders.backers.plataformapython.backend.services.PracticeService;

@RestController
@RequestMapping("/api/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceService;

    @PostMapping
    public ResponseEntity<PracticeDto> createPracticeModule(@RequestBody CreatePracticeDto dto) {
        PracticeDto createdModule = practiceService.createPractice(dto);
        return ResponseEntity.status(201).body(createdModule);
    }

    @GetMapping
    public ResponseEntity<List<PracticeDto>> getAllPracticeModules() {
        List<PracticeDto> modules = practiceService.getAllPractice();
        return ResponseEntity.ok(modules);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePracticeModule(@PathVariable Long id) {
        practiceService.deletePractice(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PracticeDto> updatePracticeModule(@PathVariable Long id, @RequestBody UpdatePracticeDto dto) {
        PracticeDto updated = practiceService.updatePractice(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/lesson/{lessonid}")
    public ResponseEntity<PracticeDto> getPracticeByLessonId(@PathVariable("lessonid") Long lessonId) {
        PracticeDto practice = practiceService.getPracticeByLessonId(lessonId);
        return ResponseEntity.ok(practice);
    }

}
