package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import com.coders.backers.plataformapython.backend.dto.ResourceTypeDto;

public class ResourceTypeMapper {

    public static ResourceTypeDto toDto(ResourceTypeModel model) {
        return new ResourceTypeDto(
            model.getTypeId(),
            model.getExtension(),
            model.getName(),
            model.isActive()
        );
    }

    public static ResourceTypeModel toModel(ResourceTypeDto dto) {
        ResourceTypeModel model = new ResourceTypeModel();
        model.setExtension(dto.getExtension());
        model.setName(dto.getName());
        model.setActive(dto.isActive());
        return model;
    }
}
