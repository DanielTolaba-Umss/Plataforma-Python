package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;

public interface ResourceService {
    ResourceDto create(ResourceDto dto);
    ResourceDto getById(Long id);
    List<ResourceDto> getAll();
    ResourceDto update(Long id, ResourceDto dto);
    void delete(Long id);
}
