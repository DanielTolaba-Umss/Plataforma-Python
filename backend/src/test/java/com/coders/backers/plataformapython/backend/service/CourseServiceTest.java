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

import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.UpdateCourseDto;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.services.impl.CourseServiceImpl;

public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;    @InjectMocks
    private CourseServiceImpl courseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createCourse_ShouldReturnNewCourse() {
        // Arrange
        CreateCourseDto createDto = new CreateCourseDto();
        createDto.setTitle("Python Básico");
        createDto.setDescription("Curso introductorio de Python");
        createDto.setLevel("BASIC");
        createDto.setOrden(1);

        CourseEntity courseEntity = new CourseEntity();
        courseEntity.setId(1L);
        courseEntity.setTitle(createDto.getTitle());
        courseEntity.setDescription(createDto.getDescription());
        courseEntity.setLevel(createDto.getLevel());
        courseEntity.setOrden(createDto.getOrden());

        when(courseRepository.save(any(CourseEntity.class))).thenReturn(courseEntity);

        // Act
        CourseDto result = courseService.createCourse(createDto);

        // Assert
        assertNotNull(result);
        assertEquals("Python Básico", result.getTitle());
        assertEquals("BASIC", result.getLevel());
        verify(courseRepository).save(any(CourseEntity.class));
    }

    @Test
    void getAllCourses_ShouldReturnList() {
        // Arrange
        CourseEntity course1 = new CourseEntity();
        course1.setId(1L);
        course1.setTitle("Python Básico");
        course1.setLevel("BASIC");

        CourseEntity course2 = new CourseEntity();
        course2.setId(2L);
        course2.setTitle("Python Intermedio");
        course2.setLevel("INTERMEDIATE");

        when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

        // Act
        List<CourseDto> results = courseService.getAllCourses();

        // Assert
        assertEquals(2, results.size());
        assertEquals("Python Básico", results.get(0).getTitle());
        verify(courseRepository).findAll();
    }

    @Test
    void getCourseById_WhenExists_ShouldReturnCourse() {
        // Arrange
        Long courseId = 1L;
        CourseEntity course = new CourseEntity();
        course.setId(courseId);
        course.setTitle("Python Básico");

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        // Act
        CourseDto result = courseService.getCourseById(courseId);

        // Assert
        assertNotNull(result);
        assertEquals(courseId, result.getId());
        assertEquals("Python Básico", result.getTitle());
    }    @Test
    void updateCourse_ShouldUpdateAndReturnCourse() {
        // Arrange
        Long courseId = 1L;
        UpdateCourseDto updateDto = new UpdateCourseDto();
        updateDto.setTitle("Python Básico Actualizado");
        updateDto.setDescription("Curso actualizado");
        updateDto.setLevel("INTERMEDIATE");

        CourseEntity existingCourse = new CourseEntity();
        existingCourse.setId(courseId);
        
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(existingCourse));
        when(courseRepository.save(any(CourseEntity.class))).thenReturn(existingCourse);

        // Act
        CourseDto result = courseService.updateCourse(courseId, updateDto);

        // Assert
        assertNotNull(result);
        verify(courseRepository).findById(courseId);
        verify(courseRepository).save(any(CourseEntity.class));
    }

    @Test
    void deleteCourse_ShouldDeleteSuccessfully() {
        // Arrange
        Long courseId = 1L;
        CourseEntity course = new CourseEntity();
        course.setId(courseId);

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        // Act
        courseService.deleteCourse(courseId);

        // Assert
        verify(courseRepository).delete(course);
    }
}
