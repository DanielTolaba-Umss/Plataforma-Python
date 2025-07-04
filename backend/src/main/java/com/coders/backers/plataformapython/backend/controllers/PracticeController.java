package com.coders.backers.plataformapython.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PracticeDto> createPracticeModule(@RequestBody CreatePracticeDto dto) {
        System.out.println("PracticeController: Recibida solicitud POST /api/practice");
        System.out.println("PracticeController: Usuario autenticado: " + 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
        System.out.println("PracticeController: Authorities: " + 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        
        PracticeDto createdModule = practiceService.createPractice(dto);
        return ResponseEntity.status(201).body(createdModule);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<PracticeDto>> getAllPracticeModules() {
        List<PracticeDto> modules = practiceService.getAllPractice();
        return ResponseEntity.ok(modules);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deletePracticeModule(@PathVariable Long id) {
        practiceService.deletePractice(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PracticeDto> updatePracticeModule(@PathVariable Long id, @RequestBody UpdatePracticeDto dto) {
        PracticeDto updated = practiceService.updatePractice(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/lesson/{lessonid}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<PracticeDto> getPracticeByLessonId(@PathVariable("lessonid") Long lessonId) {
        PracticeDto practice = practiceService.getPracticeByLessonId(lessonId);
        return ResponseEntity.ok(practice);
    }

}
