package com.coders.backers.plataformapython.backend.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.CreateLessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.UpdateLessonDto;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.services.impl.LessonServiceImpl;

import com.coders.backers.plataformapython.backend.repository.CourseRepository;

public class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private CourseRepository courseRepository;    @InjectMocks
    private LessonServiceImpl lessonService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createLesson_ShouldReturnNewLesson() {
        // Arrange
        Long courseId = 1L;
        CourseEntity course = new CourseEntity();
        course.setId(courseId);        CreateLessonDto createDto = new CreateLessonDto();
        createDto.setTitle("Variables en Python");
        createDto.setDescription("Introducción a variables");
        createDto.setCourseId(courseId);
        
        LessonEntity lessonEntity = new LessonEntity();
        lessonEntity.setId(1L);
        lessonEntity.setTitle(createDto.getTitle());
        lessonEntity.setDescription(createDto.getDescription());
        lessonEntity.setCourse(course);

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(lessonRepository.save(any(LessonEntity.class))).thenReturn(lessonEntity);

        // Act
        LessonDto result = lessonService.createLesson(createDto);

        // Assert
        assertNotNull(result);
        assertEquals("Variables en Python", result.getTitle());
        verify(lessonRepository).save(any(LessonEntity.class));
    }    @Test
    void getLessonsByCourseId_ShouldReturnList() {
        // Arrange
        Long courseId = 1L;
        CourseEntity course = new CourseEntity();
        course.setId(courseId);

        LessonEntity lesson1 = new LessonEntity();
        lesson1.setId(1L);
        lesson1.setTitle("Lección 1");
        lesson1.setCourse(course);

        LessonEntity lesson2 = new LessonEntity();
        lesson2.setId(2L);
        lesson2.setTitle("Lección 2");
        lesson2.setCourse(course);        when(courseRepository.existsById(courseId)).thenReturn(true);
        when(lessonRepository.findByCourseId(courseId)).thenReturn(Arrays.asList(lesson1, lesson2));

        // Act
        List<LessonDto> results = lessonService.getLessonsByCourseId(courseId);

        // Assert
        assertEquals(2, results.size());
        assertEquals("Lección 1", results.get(0).getTitle());
        verify(lessonRepository).findByCourseId(courseId);
    }

    @Test
    void getLessonById_WhenExists_ShouldReturnLesson() {
        // Arrange
        Long lessonId = 1L;
        LessonEntity lesson = new LessonEntity();
        lesson.setId(lessonId);
        lesson.setTitle("Variables en Python");

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(lesson));

        // Act
        LessonDto result = lessonService.getLessonById(lessonId);

        // Assert
        assertNotNull(result);
        assertEquals(lessonId, result.getId());
        assertEquals("Variables en Python", result.getTitle());
    }    @Test
    void updateLesson_ShouldUpdateAndReturnLesson() {
        // Arrange
        Long lessonId = 1L;
        UpdateLessonDto updateDto = new UpdateLessonDto();
        updateDto.setTitle("Variables en Python - Actualizado");
        updateDto.setDescription("Descripción actualizada");

        LessonEntity existingLesson = new LessonEntity();
        existingLesson.setId(lessonId);
        
        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(existingLesson));
        when(lessonRepository.save(any(LessonEntity.class))).thenReturn(existingLesson);

        // Act
        LessonDto result = lessonService.updateLesson(lessonId, updateDto);

        // Assert
        assertNotNull(result);
        verify(lessonRepository).findById(lessonId);
        verify(lessonRepository).save(any(LessonEntity.class));
    }

    @Test
    void deleteLesson_ShouldDeleteSuccessfully() {
        // Arrange
        Long lessonId = 1L;
        LessonEntity lesson = new LessonEntity();
        lesson.setId(lessonId);

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(lesson));

        // Act
        lessonService.deleteLesson(lessonId);

        // Assert
        verify(lessonRepository).delete(lesson);
    }
}
