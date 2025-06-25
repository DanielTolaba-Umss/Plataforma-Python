package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.student.StudentCourseDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentLessonDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProfileDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProgressDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentProfileDto;

import java.util.List;

public interface StudentProfileService {
    
    /**
     * Obtiene el perfil del estudiante por email
     */
    StudentProfileDto getStudentProfile(String email);
    
    /**
     * Actualiza el perfil del estudiante
     */
    StudentProfileDto updateStudentProfile(String email, UpdateStudentProfileDto updateDto);
    
    /**
     * Obtiene los cursos inscritos del estudiante
     */
    List<StudentCourseDto> getStudentCourses(String email);
      /**
     * Obtiene el progreso general del estudiante
     */
    StudentProgressDto getStudentProgress(String email);
    
    /**
     * Obtiene las lecciones de un curso específico con el progreso del estudiante
     */
    List<StudentLessonDto> getStudentCourseLessons(String email, Long courseId);
}
