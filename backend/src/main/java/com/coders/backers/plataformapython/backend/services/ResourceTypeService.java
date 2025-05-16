package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.ResourceTypeDto;
import java.util.List;

public interface ResourceTypeService {
    ResourceTypeDto create(ResourceTypeDto dto);
    ResourceTypeDto getById(Long id);
    List<ResourceTypeDto> getAll();
    ResourceTypeDto update(Long id, ResourceTypeDto dto);
    void delete(Long id);
}
