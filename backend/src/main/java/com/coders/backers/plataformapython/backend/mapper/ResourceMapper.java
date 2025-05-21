package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.models.ResourceModel;
import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;
import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;

public class ResourceMapper {

    public static ResourceDto toDto(ResourceModel model) {
        return new ResourceDto(
            model.getResourceId(),
            model.getContent().getContenidoId(),
            model.getType().getTypeId(),
            model.getUrl(),
            model.getTitle()
        );
    }

    public static ResourceModel toModel(ResourceDto dto, ContenidoModel content, ResourceTypeModel type) {
        
        ResourceModel model = new ResourceModel();
        model.setTitle(dto.getTitle());
        model.setContent(content);
        model.setType(type);
        model.setUrl(dto.getUrl());

        return model;
    }
}
