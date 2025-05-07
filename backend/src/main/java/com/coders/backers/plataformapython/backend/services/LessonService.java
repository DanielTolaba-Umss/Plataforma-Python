package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.lesson.LessonDTO;
import com.coders.backers.plataformapython.backend.models.LessonModel;
import com.coders.backers.plataformapython.backend.models.ModuleEntity;
import com.coders.backers.plataformapython.backend.models.ModuleModel;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.repository.ModuleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;

    public LessonService(LessonRepository lessonRepository, ModuleRepository moduleRepository) {
        this.lessonRepository = lessonRepository;
        this.moduleRepository = moduleRepository;
    }

    public LessonDTO create(LessonDTO dto) {
        ModuleEntity modulo = moduleRepository.findById(dto.getModuloId())
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado"));

        LessonModel lesson = new LessonModel();
        lesson.setTitulo(dto.getTitulo());
        lesson.setContenido(dto.getContenido());
        lesson.setActivo(dto.isActivo());
        lesson.setModulo(modulo);

        return mapToDTO(lessonRepository.save(lesson));
    }

    public List<LessonDTO> getAll() {
        return lessonRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private LessonDTO mapToDTO(LessonModel lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setTitulo(lesson.getTitulo());
        dto.setContenido(lesson.getContenido());
        dto.setActivo(lesson.isActivo());
        dto.setModuloId(lesson.getModulo().getId());
        return dto;
    }
}