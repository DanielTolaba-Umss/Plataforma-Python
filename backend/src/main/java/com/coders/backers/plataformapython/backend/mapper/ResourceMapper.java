package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.models.ResourceModel;
import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;

public class ResourceMapper {

    public static ResourceDto toDto(ResourceModel model) {
        ResourceDto dto = new ResourceDto();
        dto.setResourceId(model.getResourceId());
        dto.setContentId(model.getContent().getId());
        dto.setTypeId(model.getType().getTypeId());
        dto.setUrl(model.getUrl());
        dto.setTitle(model.getTitle());
        dto.setSource(model.getSource());
        dto.setSourceType(model.getSourceType());
        return dto;
    }

    public static ResourceModel toModel(ResourceDto dto, LessonEntity content, ResourceTypeModel type) {
        ResourceModel model = new ResourceModel();
        model.setContent(content);
        model.setType(type);
        model.setUrl(dto.getUrl());
        model.setTitle(dto.getTitle());
        model.setSource(dto.getSource());
        model.setSourceType(dto.getSourceType());
        return model;
    }
}
