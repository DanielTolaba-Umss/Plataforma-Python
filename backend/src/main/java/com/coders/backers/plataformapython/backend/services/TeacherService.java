package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;

public interface TeacherService {
    // Create
    TeacherDto createTeacher(CreateTeacherDto createTeacherDto);
    
    //Update
    //TeacherDto updateTeacher(Long id, CreateTeacherDto createTeacherDto);
    //TeacherDto deactivateTeacher(Long id);
    //TeacherDto activateTeacher(Long id);
    
    // Read
    List<TeacherDto> getAllTeachers();
    List<TeacherDto> getAllActiveTeachers();
    //TeacherDto getTeacherById(Long id);
    //TeacherDto getTeacherByEmail(String email);
    //TeacherDto getTeacherBySpecialty(String specialty);
    
    // Delete
    void deleteTeacher(Long id);

    // Search
    List<TeacherDto> searchTeachersBySpecialty(String specialty);


}
