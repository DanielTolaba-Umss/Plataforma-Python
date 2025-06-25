package com.coders.backers.plataformapython.backend.controllers;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.services.LessonService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private LessonService lessonService; // Create

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LessonDto> createLesson(@RequestBody CreateLessonDto createLessonDto) {
        LessonDto savedLesson = lessonService.createLesson(createLessonDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLesson);
    }

    // Read
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        LessonDto lessonDto = lessonService.getLessonById(id);
        return ResponseEntity.ok(lessonDto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<LessonDto>> getAllLessons(
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "courseId", required = false) Long courseId,
            @RequestParam(value = "level", required = false) String level) {

        List<LessonDto> lessons;

        if (courseId != null && level != null && active != null && active) {
            lessons = lessonService.getActiveLessonsByCourseIdAndLevel(courseId, level);
        } else if (courseId != null && level != null) {
            lessons = lessonService.getLessonsByCourseIdAndLevel(courseId, level);
        } else if (courseId != null && active != null && active) {
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

    @GetMapping("/course/{courseId}/level/{level}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<LessonDto>> getLessonsByCourseAndLevel(
            @PathVariable Long courseId,
            @PathVariable String level,
            @RequestParam(value = "active", required = false) Boolean active) {

        List<LessonDto> lessons;

        if (active != null && active) {
            lessons = lessonService.getActiveLessonsByCourseIdAndLevel(courseId, level);
        } else {
            lessons = lessonService.getLessonsByCourseIdAndLevel(courseId, level);
        }

        return ResponseEntity.ok(lessons);
    }

    // Update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LessonDto> updateLesson(
            @PathVariable Long id,
            @RequestBody UpdateLessonDto updateLessonDto) {
        LessonDto updatedLesson = lessonService.updateLesson(id, updateLessonDto);
        return ResponseEntity.ok(updatedLesson);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LessonDto> activateLesson(@PathVariable Long id) {
        LessonDto activatedLesson = lessonService.activateLesson(id);
        return ResponseEntity.ok(activatedLesson);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LessonDto> deactivateLesson(@PathVariable Long id) {
        LessonDto deactivatedLesson = lessonService.deactivateLesson(id);
        return ResponseEntity.ok(deactivatedLesson);
    }
    // Delete

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede eliminar la lección porque tiene dependencias (recursos, prácticas, progreso de estudiantes)");
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error en logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }
}