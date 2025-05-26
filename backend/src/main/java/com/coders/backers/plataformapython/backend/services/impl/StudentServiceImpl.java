package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;
import com.coders.backers.plataformapython.backend.mapper.StudentMapper;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.services.StudentService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;    @Override
    public StudentDto createStudent(CreateStudentDto dto) {
        StudentEntity entity = StudentMapper.mapFromCreateDto(dto);
        
        // Asignar cursos si los hay
        if (dto.getCursos() != null && !dto.getCursos().isEmpty()) {
            Set<CourseEntity> courses = assignCoursesToStudent(dto.getCursos());
            entity.setCourses(courses);
        }
        
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
    }    @Override
    public Optional<StudentDto> updateStudent(Long id, UpdateStudentDto dto) {
        return studentRepository.findById(id).map(existing -> {
            StudentEntity updatedEntity = StudentMapper.mapFromUpdateDto(dto, existing);
            updatedEntity.setId(id); // Mantener el ID original
            
            // Actualizar cursos si los hay
            if (dto.getCursos() != null) {
                Set<CourseEntity> courses = assignCoursesToStudent(dto.getCursos());
                updatedEntity.setCourses(courses);
            }
            
            StudentEntity saved = studentRepository.save(updatedEntity);
            return StudentMapper.mapToDto(saved);
        });
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    
    /**
     * Método helper para asignar cursos a un estudiante
     */
    private Set<CourseEntity> assignCoursesToStudent(List<Long> courseIds) {
        Set<CourseEntity> courses = new HashSet<>();
        if (courseIds != null && !courseIds.isEmpty()) {
            for (Long courseId : courseIds) {
                courseRepository.findById(courseId).ifPresent(courses::add);
            }
        }
        return courses;
    }
}