package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.multimedia.MultimediaContentDTO;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.MultimediaContentMapper;
import com.coders.backers.plataformapython.backend.models.LessonModel;
import com.coders.backers.plataformapython.backend.models.MultimediaContentModel;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.repository.MultimediaContentRepository;
import com.coders.backers.plataformapython.backend.services.MultimediaContentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MultimediaContentServiceImpl implements MultimediaContentService {

    private final MultimediaContentRepository contentRepository;
    private final LessonRepository leccionRepository;

    public MultimediaContentServiceImpl(MultimediaContentRepository contentRepository, LessonRepository leccionRepository) {
        this.contentRepository = contentRepository;
        this.leccionRepository = leccionRepository;
    }

    @Override
    public MultimediaContentDTO getById(Long id) {
        MultimediaContentModel model = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado con id: " + id));
        return MultimediaContentMapper.toDTO(model);
    }

    @Override
    public List<MultimediaContentDTO> getAll() {
        return contentRepository.findAll()
                .stream()
                .map(MultimediaContentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MultimediaContentDTO create(MultimediaContentDTO dto) {
        LessonModel leccion = leccionRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + dto.getLeccionId()));
        MultimediaContentModel model = MultimediaContentMapper.toModel(dto, leccion);
        return MultimediaContentMapper.toDTO(contentRepository.save(model));
    }

    @Override
    public MultimediaContentDTO update(Long id, MultimediaContentDTO dto) {
        MultimediaContentModel existing = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado con id: " + id));
        LessonModel leccion = leccionRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + dto.getLeccionId()));
        MultimediaContentModel updated = MultimediaContentMapper.toModel(dto, leccion);
        updated.setId(existing.getId());
        return MultimediaContentMapper.toDTO(contentRepository.save(updated));
    }

    @Override
    public void delete(Long id) {
        MultimediaContentModel existing = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado con id: " + id));
        contentRepository.delete(existing);
    }
}
