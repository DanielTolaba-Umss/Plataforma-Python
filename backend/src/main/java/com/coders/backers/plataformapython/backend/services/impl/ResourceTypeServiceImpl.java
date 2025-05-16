package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import com.coders.backers.plataformapython.backend.mapper.ResourceTypeMapper;
import com.coders.backers.plataformapython.backend.repository.ResourceTypeRepository;
import com.coders.backers.plataformapython.backend.services.ResourceTypeService;
import com.coders.backers.plataformapython.backend.dto.resourceType.ResourceTypeDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceTypeServiceImpl implements ResourceTypeService {

    private final ResourceTypeRepository repository;

    public ResourceTypeServiceImpl(ResourceTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public ResourceTypeDto create(ResourceTypeDto dto) {
        ResourceTypeModel model = ResourceTypeMapper.toModel(dto);
        return ResourceTypeMapper.toDto(repository.save(model));
    }

    @Override
    public ResourceTypeDto getById(Long id) {
        ResourceTypeModel model = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ResourceType not found"));
        return ResourceTypeMapper.toDto(model);
    }

    @Override
    public List<ResourceTypeDto> getAll() {
        return repository.findAll().stream()
            .map(ResourceTypeMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public ResourceTypeDto update(Long id, ResourceTypeDto dto) {
        ResourceTypeModel model = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ResourceType not found"));

        model.setExtension(dto.getExtension());
        model.setName(dto.getName());
        model.setActive(dto.isActive());

        return ResourceTypeMapper.toDto(repository.save(model));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("ResourceType not found");
        }
        repository.deleteById(id);
    }
}
