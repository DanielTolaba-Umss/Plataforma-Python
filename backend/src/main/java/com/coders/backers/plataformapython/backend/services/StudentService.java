package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    StudentDto createStudent(CreateStudentDto dto);

    List<StudentDto> getAllStudents();

    Optional<StudentDto> getStudentById(Long id);

    Optional<StudentDto> updateStudent(Long id, UpdateStudentDto dto);

    void deleteStudent(Long id);
}
