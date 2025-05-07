package com.coders.backers.plataformapython.backend.controllers;


import com.coders.backers.plataformapython.backend.dto.course.CourseDTO;
import com.coders.backers.plataformapython.backend.models.CourseModel;
import com.coders.backers.plataformapython.backend.services.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAll() {
        return ResponseEntity.ok(courseService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CourseModel> create(@Valid @RequestBody CourseDTO dto) {
        return ResponseEntity.ok(courseService.create(dto));
    }
}