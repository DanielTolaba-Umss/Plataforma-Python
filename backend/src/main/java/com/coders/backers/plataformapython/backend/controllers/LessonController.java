package com.coders.backers.plataformapython.backend.controllers;


import com.coders.backers.plataformapython.backend.dto.lesson.LessonDTO;
import com.coders.backers.plataformapython.backend.services.LessonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping
    public ResponseEntity<LessonDTO> create(@Valid @RequestBody LessonDTO dto) {
        return ResponseEntity.ok(lessonService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<LessonDTO>> getAll() {
        return ResponseEntity.ok(lessonService.getAll());
    }
}