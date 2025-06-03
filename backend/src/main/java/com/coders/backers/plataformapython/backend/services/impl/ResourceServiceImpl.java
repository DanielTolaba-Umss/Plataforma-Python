package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.mapper.ResourceMapper;
import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import com.coders.backers.plataformapython.backend.models.ResourceModel;
import com.coders.backers.plataformapython.backend.repository.ContenidoRepository;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.repository.ResourceTypeRepository;
import com.coders.backers.plataformapython.backend.repository.ResourceRepository;
import com.coders.backers.plataformapython.backend.services.ResourceService;
import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repository;
   // private final ContenidoRepository contenidoRepository;
   private final LessonRepository lessonRepository;
    private final ResourceTypeRepository typeRepository;

    public ResourceServiceImpl(ResourceRepository repository, LessonRepository courseRepository, ResourceTypeRepository typeRepository) {
        this.repository = repository;
        this.lessonRepository = courseRepository;
        this.typeRepository = typeRepository;
    }

    @Override
    public ResourceDto create(ResourceDto dto) {
        LessonEntity content = lessonRepository.findById(dto.getContentId())
            .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        ResourceTypeModel type = typeRepository.findById(dto.getTypeId())
            .orElseThrow(() -> new ResourceNotFoundException("ResourceType not found"));

        ResourceModel model = ResourceMapper.toModel(dto, content, type);

        model.setSourceType(dto.getSourceType());
        model.setSource(dto.getSource());

        return ResourceMapper.toDto(repository.save(model));
    }

    @Override
    public ResourceDto getById(Long id) {
        ResourceModel model = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        return ResourceMapper.toDto(model);
    }

    @Override
    public List<ResourceDto> getAll() {
        return repository.findAll().stream()
            .map(ResourceMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public ResourceDto update(Long id, ResourceDto dto) {
        ResourceModel existing = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        LessonEntity content = lessonRepository.findById(dto.getContentId())
            .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        ResourceTypeModel type = typeRepository.findById(dto.getTypeId())
            .orElseThrow(() -> new ResourceNotFoundException("ResourceType not found"));

        existing.setContent(content);
        existing.setType(type);
        existing.setUrl(dto.getUrl());
        existing.setTitle(dto.getTitle());

        existing.setSourceType(dto.getSourceType());
        existing.setSource(dto.getSource());

        return ResourceMapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found");
        }
        repository.deleteById(id);
    }

    @Override
    public List<ResourceDto> findByLessonId(Long leccion_id) {
        List<ResourceModel> resources = repository.findByContent_Id(leccion_id);
        return resources.stream()
                .map(ResourceMapper::toDto) 
                .toList();
    }
}

