package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.lesson.CreateLessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.UpdateLessonDto;

public interface LessonService {

    // Create
    LessonDto createLesson(CreateLessonDto createLessonDto);
    
    // Read
    LessonDto getLessonById(Long id);
    List<LessonDto> getAllLessons();
    List<LessonDto> getActiveLessons();
    List<LessonDto> getLessonsByCourseId(Long courseId);
    List<LessonDto> getActiveLessonsByCourseId(Long courseId);
    List<LessonDto> getLessonsByCourseIdAndLevel(Long courseId, String level);
    List<LessonDto> getActiveLessonsByCourseIdAndLevel(Long courseId, String level);
    
    // Update
    LessonDto updateLesson(Long id, UpdateLessonDto updateLessonDto);
    LessonDto activateLesson(Long id);
    LessonDto deactivateLesson(Long id);
    
    // Delete
    void deleteLesson(Long id);
    
    // Búsqueda
    List<LessonDto> searchLessonsByTitle(String title);
}