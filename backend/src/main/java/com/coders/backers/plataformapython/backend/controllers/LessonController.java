package com.coders.backers.plataformapython.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.AllArgsConstructor;

import com.coders.backers.plataformapython.backend.dto.lesson.CreateLessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.UpdateLessonDto;
import com.coders.backers.plataformapython.backend.services.LessonService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private LessonService lessonService;

    // Create
    @PostMapping
    public ResponseEntity<LessonDto> createLesson(@RequestBody CreateLessonDto createLessonDto) {
        LessonDto savedLesson = lessonService.createLesson(createLessonDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLesson);
    }

    // Read
    @GetMapping("/{id}")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        LessonDto lessonDto = lessonService.getLessonById(id);
        return ResponseEntity.ok(lessonDto);
    }
    
    @GetMapping
    public ResponseEntity<List<LessonDto>> getAllLessons(
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "courseId", required = false) Long courseId) {
        
        List<LessonDto> lessons;
        
        if (courseId != null && active != null) {
            lessons = lessonService.getActiveLessonsByCourseId(courseId);
        } else if (courseId != null) {
            lessons = lessonService.getLessonsByCourseId(courseId);
        } else if (title != null && !title.isEmpty()) {
            lessons = lessonService.searchLessonsByTitle(title);
        } else if (active != null && active) {
            lessons = lessonService.getActiveLessons();
        } else {
            lessons = lessonService.getAllLessons();
        }
        
        return ResponseEntity.ok(lessons);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<LessonDto> updateLesson(
            @PathVariable Long id, 
            @RequestBody UpdateLessonDto updateLessonDto) {
        LessonDto updatedLesson = lessonService.updateLesson(id, updateLessonDto);
        return ResponseEntity.ok(updatedLesson);
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<LessonDto> activateLesson(@PathVariable Long id) {
        LessonDto activatedLesson = lessonService.activateLesson(id);
        return ResponseEntity.ok(activatedLesson);
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<LessonDto> deactivateLesson(@PathVariable Long id) {
        LessonDto deactivatedLesson = lessonService.deactivateLesson(id);
        return ResponseEntity.ok(deactivatedLesson);
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}