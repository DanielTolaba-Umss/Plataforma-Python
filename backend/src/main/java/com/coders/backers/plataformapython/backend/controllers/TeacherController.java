package com.coders.backers.plataformapython.backend.controllers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.UpdateTeacherDto;
import com.coders.backers.plataformapython.backend.services.TeacherService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@AllArgsConstructor
@RestController
@RequestMapping("/api/teachers")
@Slf4j
public class TeacherController {
    private TeacherService teacherService;

    @PostMapping
    public ResponseEntity<TeacherDto> createTeacher(@RequestBody CreateTeacherDto createTeacherDto) {
        
        TeacherDto savedTeacher = teacherService.createTeacher(createTeacherDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTeacher);
    }

    @GetMapping
    public ResponseEntity<List<TeacherDto>> getAllTeachers(
        @RequestParam(value = "active", required = false) Boolean active,
        @RequestParam(value = "specialty", required = false) String specialty
    ) {
        
        List<TeacherDto> teachers;
        
        if (specialty != null && !specialty.isEmpty()) {
            teachers = teacherService.searchTeachersBySpecialty(specialty);
        } else if (active != null) {
            if (active) {
                teachers = teacherService.getAllActiveTeachers();
            } else {
                teachers = teacherService.getAllInactiveTeachers();
            }
        } else {
            teachers = teacherService.getAllTeachers();
        }
        
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDto> getTeacherById(@PathVariable Long id) {
        TeacherDto teacher = teacherService.getTeacherById(id);
        return ResponseEntity.ok(teacher);
    }


    @PutMapping("/{id}")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable Long id, @RequestBody UpdateTeacherDto updateTeacherDto) {
        TeacherDto updatedTeacher = teacherService.updateTeacher(id, updateTeacherDto);
        return ResponseEntity.ok(updatedTeacher);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<TeacherDto> activateTeacher(@PathVariable Long id) {
        TeacherDto activatedTeacher = teacherService.activateTeacher(id);
        return ResponseEntity.ok(activatedTeacher);
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<TeacherDto> deactivateTeacher(@PathVariable Long id) {
        TeacherDto deactivatedTeacher = teacherService.deactivateTeacher(id);
        return ResponseEntity.ok(deactivatedTeacher);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
    
}
