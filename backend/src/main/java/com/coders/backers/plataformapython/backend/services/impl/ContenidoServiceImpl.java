package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.content.ContenidoDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.ContenidoMapper;
import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.repository.ContenidoRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.services.ContenidoService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContenidoServiceImpl implements ContenidoService {

    private final ContenidoRepository repository;
    private final LessonRepository leccionRepository;

    public ContenidoServiceImpl(ContenidoRepository repository, LessonRepository leccionRepository) {
        this.repository = repository;
        this.leccionRepository = leccionRepository;
    }

    @Override
    public ContenidoDto getById(Long id) {
        return repository.findById(id)
                .map(ContenidoMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado con id: " + id));
    }

    @Override
    public List<ContenidoDto> getAll() {
        return repository.findAll().stream().map(ContenidoMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public ContenidoDto create(ContenidoDto dto) {
        LessonEntity leccion = leccionRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada"));
        ContenidoModel model = ContenidoMapper.toModel(dto, leccion);
        model.setCreationDate(LocalDateTime.now());
        model.setUpdateDate(LocalDateTime.now());
        return ContenidoMapper.toDTO(repository.save(model));
    }

    @Override
    public ContenidoDto update(Long id, ContenidoDto dto) {
        ContenidoModel existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado con id: " + id));
        LessonEntity leccion = leccionRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada"));
        existing.setLeccion(leccion);
        existing.setActive(dto.isActive());
        existing.setUpdateDate(LocalDateTime.now());
        return ContenidoMapper.toDTO(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        ContenidoModel existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado con id: " + id));
        repository.delete(existing);
    }
}
