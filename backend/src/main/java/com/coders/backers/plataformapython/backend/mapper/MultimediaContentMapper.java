package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.MultimediaContentDTO;
import com.coders.backers.plataformapython.backend.models.LessonModel;
import com.coders.backers.plataformapython.backend.models.MultimediaContentModel;

public class MultimediaContentMapper {

    public static MultimediaContentDTO toDTO(MultimediaContentModel model) {
        MultimediaContentDTO dto = new MultimediaContentDTO();
        dto.setId(model.getId());
        dto.setTipo(model.getTipo());
        dto.setTitulo(model.getTitulo());
        dto.setDescripcion(model.getDescripcion());
        dto.setUrl(model.getUrl());
        dto.setDuracion(model.getDuracion());
        dto.setOrden(model.getOrden());
        dto.setActivo(model.isActivo());
        dto.setLeccionId(model.getLeccion() != null ? model.getLeccion().getId() : null);
        return dto;
    }

    public static MultimediaContentModel toModel(MultimediaContentDTO dto, LessonModel leccion) {
        MultimediaContentModel model = new MultimediaContentModel();
        model.setId(dto.getId());
        model.setTipo(dto.getTipo());
        model.setTitulo(dto.getTitulo());
        model.setDescripcion(dto.getDescripcion());
        model.setUrl(dto.getUrl());
        model.setDuracion(dto.getDuracion());
        model.setOrden(dto.getOrden());
        model.setActivo(dto.isActivo());
        model.setLesson(leccion);
        return model;
    }
}
