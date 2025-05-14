package com.coders.backers.plataformapython.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.coders.backers.plataformapython.backend.dto.practice.*;
import com.coders.backers.plataformapython.backend.services.PracticeService;

@RestController
@RequestMapping("/api/practice-modules")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceModuleService;

    @PostMapping
    public ResponseEntity<PracticeModuleDto> createPracticeModule(@RequestBody CreatePracticeModuleDto dto) {
        PracticeModuleDto createdModule = practiceModuleService.createPracticeModule(dto);
        return ResponseEntity.status(201).body(createdModule);
    }

    @GetMapping
    public ResponseEntity<List<PracticeModuleDto>> getAllPracticeModules() {
        List<PracticeModuleDto> modules = practiceModuleService.getAllPracticeModules();
        return ResponseEntity.ok(modules);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePracticeModule(@PathVariable Long id) {
        practiceModuleService.deletePracticeModule(id);
        return ResponseEntity.noContent().build();
    }
}
