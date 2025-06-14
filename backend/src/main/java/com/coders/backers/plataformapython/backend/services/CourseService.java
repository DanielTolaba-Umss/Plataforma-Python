package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.dto.course.UpdateCourseDto;

public interface CourseService {

    // Create
    CourseDto createCourse(CreateCourseDto createCourseDto);
    
    // Read
    CourseDto getCourseById(Long id);
    List<CourseDto> getAllCourses();
    List<CourseDto> getActiveCourses();
    List<CourseDto> getCoursesByLevel(String level);
    
    // Update
    CourseDto updateCourse(Long id, UpdateCourseDto updateCourseDto);
    CourseDto activateCourse(Long id);
    CourseDto deactivateCourse(Long id);
    
    // Delete
    void deleteCourse(Long id);
    
    // Búsqueda
    List<CourseDto> searchCoursesByTitle(String title);
}