package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;
import com.coders.backers.plataformapython.backend.mapper.StudentMapper;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public StudentDto createStudent(CreateStudentDto dto) {
        StudentEntity entity = StudentMapper.mapFromCreateDto(dto);
        StudentEntity saved = studentRepository.save(entity);
        return StudentMapper.mapToDto(saved);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<StudentDto> getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(StudentMapper::mapToDto);
    }

    @Override
    public Optional<StudentDto> updateStudent(Long id, UpdateStudentDto dto) {
        return studentRepository.findById(id).map(existing -> {
            StudentEntity updatedEntity = StudentMapper.mapFromUpdateDto(dto);
            updatedEntity.setId(id); // Mantener el ID original
            StudentEntity saved = studentRepository.save(updatedEntity);
            return StudentMapper.mapToDto(saved);
        });
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}