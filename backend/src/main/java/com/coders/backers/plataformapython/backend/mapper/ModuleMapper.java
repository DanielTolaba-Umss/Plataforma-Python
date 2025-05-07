package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.module.CreateModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.models.ModuleEntity;

public class ModuleMapper {

    public static ModuleDto mapToModelDto(ModuleEntity model) {
        return new ModuleDto(
                model.getId(),
                model.getTitle(),
                model.getDescription(),
                model.getOrden(),
                model.getCreatedAt(),
                model.getUpdatedAt(),
                model.isActive()
        );
    }

    public static ModuleEntity mapToModel(ModuleDto moduleDto) {
        return new ModuleEntity(
                moduleDto.getId(),
                moduleDto.getTitle(),
                moduleDto.getDescription(),
                moduleDto.getOrden(),
                moduleDto.getCreatedAt(),
                moduleDto.getUpdatedAt(),
                moduleDto.isActive()
        );
    }
    
    public static ModuleEntity mapFromCreateDto(CreateModuleDto createDto) {
        return new ModuleEntity(
                createDto.getTitle(),
                createDto.getDescription(),
                createDto.getOrden()
        );
    }
    
}
