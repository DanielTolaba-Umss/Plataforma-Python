package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.student.StudentDTO;
import com.coders.backers.plataformapython.backend.models.CourseModel;
import com.coders.backers.plataformapython.backend.models.StudentModel;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentService(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public StudentDTO create(StudentDTO dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email ya está registrado.");
        }

        Set<CourseModel> cursos = new HashSet<>(courseRepository.findAllById(dto.getCursos()));

        StudentModel student = new StudentModel();
        student.setNombres(dto.getNombres());
        student.setApellidos(dto.getApellidos());
        student.setEmail(dto.getEmail());
        student.setTelefono(dto.getTelefono());
        student.setCiudad(dto.getCiudad());
        student.setPais(dto.getPais());
        student.setActivo(dto.isActivo());
        student.setFechaInicio(dto.getFechaInicio());
        student.setPasswordHash(dto.getPassword());
        student.setCursos(cursos);

        StudentModel saved = studentRepository.save(student);

        return mapToDTO(saved);
    }

    public List<StudentDTO> findAll() {
        return studentRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public StudentDTO findById(Long id) {
        return mapToDTO(studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado")));
    }

    public StudentDTO update(Long id, StudentDTO dto) {
        StudentModel student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado"));

        student.setNombres(dto.getNombres());
        student.setApellidos(dto.getApellidos());
        student.setTelefono(dto.getTelefono());
        student.setCiudad(dto.getCiudad());
        student.setPais(dto.getPais());
        student.setActivo(dto.isActivo());
        student.setFechaInicio(dto.getFechaInicio());

        if (dto.getCursos() != null) {
            Set<CourseModel> cursos = new HashSet<>(courseRepository.findAllById(dto.getCursos()));
            student.setCursos(cursos);
        }

        return mapToDTO(studentRepository.save(student));
    }

    public void delete(Long id) {
        studentRepository.deleteById(id);
    }

    private StudentDTO mapToDTO(StudentModel student) {
        List<Long> cursoIds = student.getCursos().stream().map(CourseModel::getId).collect(Collectors.toList());
        return new StudentDTO(
                student.getId(), student.getNombres(), student.getApellidos(), student.getEmail(),
                student.getTelefono(), student.getCiudad(), student.getPais(),
                student.isActivo(), student.getFechaInicio(), cursoIds
        );
    }
}
