package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.content.ContenidoDto;
import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.LessonEntity;

public class ContenidoMapper {

    public static ContenidoDto toDTO(ContenidoModel model) {
        ContenidoDto dto = new ContenidoDto();
        dto.setContenidoId(model.getContenidoId());
        dto.setLeccionId(model.getLeccion().getId());
        dto.setActive(model.isActive());
        dto.setCreationDate(model.getCreationDate());
        dto.setUpdateDate(model.getUpdateDate());
        return dto;
    }

    public static ContenidoModel toModel(ContenidoDto dto, LessonEntity leccion) {
        ContenidoModel model = new ContenidoModel();
        model.setLeccion(leccion);
        model.setActive(dto.isActive());
        model.setCreationDate(dto.getCreationDate());
        model.setUpdateDate(dto.getUpdateDate());
        return model;
    }
}
