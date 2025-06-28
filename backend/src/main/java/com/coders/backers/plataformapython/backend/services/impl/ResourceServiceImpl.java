package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.mapper.ResourceMapper;
import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import com.coders.backers.plataformapython.backend.models.ResourceModel;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.repository.ContenidoRepository;
import com.coders.backers.plataformapython.backend.repository.ResourceTypeRepository;
import com.coders.backers.plataformapython.backend.repository.ResourceRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.services.ResourceService;
import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repository;
    private final ContenidoRepository contenidoRepository;
    private final ResourceTypeRepository typeRepository;
    private final LessonRepository lessonRepository;

    public ResourceServiceImpl(ResourceRepository repository, ContenidoRepository contenidoRepository, 
                             ResourceTypeRepository typeRepository, LessonRepository lessonRepository) {
        this.repository = repository;
        this.contenidoRepository = contenidoRepository;
        this.typeRepository = typeRepository;
        this.lessonRepository = lessonRepository;
    }

    /**
     * Obtiene o crea un contenido para la lección especificada.
     * Si contentId corresponde a una lección, busca/crea el contenido asociado.
     * Si contentId corresponde a un contenido existente, lo devuelve directamente.
     */
    private ContenidoModel getOrCreateContentForLesson(Long contentId) {
        // Primero verificar si el ID corresponde a un contenido existente
        ContenidoModel existingContent = contenidoRepository.findById(contentId).orElse(null);
        if (existingContent != null) {
            return existingContent;
        }

        // Si no existe como contenido, verificar si es un lessonId
        LessonEntity lesson = lessonRepository.findById(contentId).orElse(null);
        if (lesson != null) {
            // Buscar contenido existente para esta lección
            List<ContenidoModel> existingContents = contenidoRepository.findByLeccion(lesson);
            if (!existingContents.isEmpty()) {
                return existingContents.get(0); // Usar el primer contenido encontrado
            }

            // Si no existe contenido para esta lección, crear uno nuevo
            ContenidoModel newContent = new ContenidoModel();
            newContent.setLeccion(lesson);
            newContent.setActive(true);
            newContent.setCreationDate(LocalDateTime.now());
            newContent.setUpdateDate(LocalDateTime.now());
            return contenidoRepository.save(newContent);
        }

        // Si no es ni contenido ni lección válida, lanzar excepción
        throw new ResourceNotFoundException("Content or Lesson not found with id: " + contentId);
    }

    @Override
    public ResourceDto create(ResourceDto dto) {
        ContenidoModel content = getOrCreateContentForLesson(dto.getContentId());

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

        ContenidoModel content = getOrCreateContentForLesson(dto.getContentId());

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
        // Buscar la lección
        LessonEntity leccion = lessonRepository.findById(leccion_id)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + leccion_id));
        
        // Buscar todos los contenidos de la lección
        List<ContenidoModel> contenidos = contenidoRepository.findByLeccion(leccion);
        
        // Buscar todos los recursos de esos contenidos
        List<ResourceModel> resources = new ArrayList<>();
        for (ContenidoModel contenido : contenidos) {
            resources.addAll(repository.findByContent_Id(contenido.getId()));
        }
        
        return resources.stream()
                .map(ResourceMapper::toDto) 
                .toList();
    }
}

