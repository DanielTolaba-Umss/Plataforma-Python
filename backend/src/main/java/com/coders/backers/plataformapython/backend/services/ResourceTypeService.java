package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.resourceType.ResourceTypeDto;

public interface ResourceTypeService {
    ResourceTypeDto create(ResourceTypeDto dto);
    ResourceTypeDto getById(Long id);
    List<ResourceTypeDto> getAll();
    ResourceTypeDto update(Long id, ResourceTypeDto dto);
    void delete(Long id);
}
