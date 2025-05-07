package com.coders.backers.plataformapython.backend.services;


import com.coders.backers.plataformapython.backend.dto.course.CourseDTO;
import com.coders.backers.plataformapython.backend.models.CourseModel;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseDTO> getAll() {
        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getById(Long id) {
        CourseModel course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        return mapToDTO(course);
    }

    public CourseModel create(CourseDTO dto) {
        CourseModel course = new CourseModel();
        course.setTitulo(dto.getTitulo());
        course.setDescripcion(dto.getDescripcion());
        course.setActivo(dto.isActivo());
        return courseRepository.save(course);
    }

    private CourseDTO mapToDTO(CourseModel model) {
        CourseDTO dto = new CourseDTO();
        dto.setId(model.getId());
        dto.setTitulo(model.getTitulo());
        dto.setDescripcion(model.getDescripcion());
        dto.setActivo(model.isActivo());
        return dto;
    }
}