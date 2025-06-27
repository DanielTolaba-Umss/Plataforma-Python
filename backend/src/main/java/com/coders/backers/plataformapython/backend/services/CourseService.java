package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.dto.course.UpdateCourseDto;

public interface CourseService {

    // Create
    CourseDto createCourse(CreateCourseDto createCourseDto);

    CourseDto createCourseByTeacherId(CreateCourseDto createCourseDto, Long teacherId);

    // Read
    CourseDto getCourseById(Long id);

    List<CourseDto> getAllCourses();

    List<CourseDto> getActiveCourses();

    List<CourseDto> getCoursesByLevel(String level);

    List<CourseDto> getCoursesByTeacherId(long id);

    // Update
    CourseDto updateCourse(Long id, UpdateCourseDto updateCourseDto);

    CourseDto activateCourse(Long id);

    CourseDto deactivateCourse(Long id);

    // Delete
    void deleteCourse(Long id);
    
    void deleteCourse(Long id, Authentication authentication);

    // Búsqueda
    List<CourseDto> searchCoursesByTitle(String title);

    // Gestión de estudiantes
    void assignStudentsToCourse(Long courseId, List<Long> studentIds, Authentication authentication);
    
    List<com.coders.backers.plataformapython.backend.dto.student.StudentDto> getUnassignedStudents(Long courseId);

}