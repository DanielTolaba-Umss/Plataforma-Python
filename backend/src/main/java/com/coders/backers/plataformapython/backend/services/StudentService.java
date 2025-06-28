package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface StudentService {
    StudentDto createStudent(CreateStudentDto dto);

    List<StudentDto> getAllStudents();

    StudentDto getStudentById(Long id);

    Optional<StudentDto> updateStudent(Long id, UpdateStudentDto dto);

    Map<String, Object> uploadStudentsFromCsv(MultipartFile file) throws IOException;

    void deleteStudent(Long id);

}
