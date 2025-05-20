package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.quiz.*;
import com.coders.backers.plataformapython.backend.models.*;

public class QuizMapper {
    public static QuizDto toDto(QuizEntity entity) {
        QuizDto dto = new QuizDto();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setDuracionMinutos(entity.getDuracionMinutos());
        dto.setIntentosPermitidos(entity.getIntentosPermitidos());
        dto.setPuntuacionAprobacion(entity.getPuntuacionAprobacion());
        dto.setAleatorio(entity.isAleatorio());
        dto.setActive(entity.isActive());
        dto.setContenidoId(entity.getContenido().getContenidoId());
        return dto;
    }

    public static QuizEntity fromCreateDto(CreateQuizDto dto, ContenidoModel contenido) {
        QuizEntity entity = new QuizEntity();
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setDuracionMinutos(dto.getDuracionMinutos());
        entity.setIntentosPermitidos(dto.getIntentosPermitidos());
        entity.setPuntuacionAprobacion(dto.getPuntuacionAprobacion());
        entity.setAleatorio(dto.isAleatorio());
        entity.setActive(dto.isActive());
        entity.setContenido(contenido);
        return entity;
    }

    public static void updateEntityFromDto(UpdateQuizDto dto, QuizEntity entity, ContenidoModel contenido) {
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setDuracionMinutos(dto.getDuracionMinutos());
        entity.setIntentosPermitidos(dto.getIntentosPermitidos());
        entity.setPuntuacionAprobacion(dto.getPuntuacionAprobacion());
        entity.setAleatorio(dto.isAleatorio());
        entity.setActive(dto.isActive());
        entity.setContenido(contenido);
    }
}


