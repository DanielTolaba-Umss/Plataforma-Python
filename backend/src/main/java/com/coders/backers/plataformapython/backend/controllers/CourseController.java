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

import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.dto.course.UpdateCourseDto;
import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.services.CourseService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private CourseService courseService;

    // Create
    @PostMapping
    public ResponseEntity<CourseDto> createCourse(@RequestBody CreateCourseDto createCourseDto) {
        CourseDto savedCourse = courseService.createCourse(createCourseDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }

    // Read
    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        CourseDto courseDto = courseService.getCourseById(id);
        return ResponseEntity.ok(courseDto);
    }
    
    @GetMapping
    public ResponseEntity<List<CourseDto>> getAllCourses(
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "level", required = false) String level) {
        
        List<CourseDto> courses;
        
        if (title != null && !title.isEmpty()) {
            courses = courseService.searchCoursesByTitle(title);
        } else if (level != null && !level.isEmpty()) {
            courses = courseService.getCoursesByLevel(level);
        } else if (active != null && active) {
            courses = courseService.getActiveCourses();
        } else {
            courses = courseService.getAllCourses();
        }
        
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/level/{level}/lessons")
    public ResponseEntity<List<LessonDto>> getLessonsByCourseDifficulty(
            @PathVariable String level,
            @RequestParam(value = "active", required = false) Boolean active) {
        List<LessonDto> lessons = courseService.getLessonsByCourseDifficulty(level, active);
        return ResponseEntity.ok(lessons);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<CourseDto> updateCourse(
            @PathVariable Long id, 
            @RequestBody UpdateCourseDto updateCourseDto) {
        CourseDto updatedCourse = courseService.updateCourse(id, updateCourseDto);
        return ResponseEntity.ok(updatedCourse);
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<CourseDto> activateCourse(@PathVariable Long id) {
        CourseDto activatedCourse = courseService.activateCourse(id);
        return ResponseEntity.ok(activatedCourse);
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<CourseDto> deactivateCourse(@PathVariable Long id) {
        CourseDto deactivatedCourse = courseService.deactivateCourse(id);
        return ResponseEntity.ok(deactivatedCourse);
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}