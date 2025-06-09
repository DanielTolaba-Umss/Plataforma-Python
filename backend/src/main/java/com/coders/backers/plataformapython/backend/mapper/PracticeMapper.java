package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.practice.PracticeDto;
import com.coders.backers.plataformapython.backend.dto.practice.UpdatePracticeDto;
import com.coders.backers.plataformapython.backend.dto.practice.CreatePracticeDto;
import com.coders.backers.plataformapython.backend.models.*;

public class PracticeMapper {

    public static PracticeDto toDto(PracticeEntity entity) {
        PracticeDto dto = new PracticeDto();
        dto.setId(entity.getId());
        dto.setInstrucciones(entity.getInstrucciones());
        dto.setCodigoInicial(entity.getCodigoInicial());
        dto.setSolucionReferencia(entity.getSolucionReferencia());
        dto.setRestricciones(entity.getRestricciones());
        dto.setIntentosMax(entity.getIntentosMax());
        if (entity.getLesson() != null) {
            dto.setLeccion(LessonMapper.mapToModelDto(entity.getLesson()));
        }
        return dto;
    }

    public static PracticeEntity fromCreateDto(CreatePracticeDto dto, LessonEntity lesson) {
        PracticeEntity entity = new PracticeEntity();
        entity.setInstrucciones(dto.getInstrucciones());
        entity.setCodigoInicial(dto.getCodigoInicial());
        entity.setSolucionReferencia(dto.getSolucionReferencia());
        entity.setRestricciones(dto.getRestricciones());
        entity.setIntentosMax(dto.getIntentosMax());
        entity.setLesson(lesson);
        return entity;
    }
    public static void updateEntityFromDto(UpdatePracticeDto dto, PracticeEntity entity, LessonEntity lesson) {
        entity.setInstrucciones(dto.getInstrucciones());
        entity.setCodigoInicial(dto.getCodigoInicial());
        entity.setSolucionReferencia(dto.getSolucionReferencia());
        entity.setRestricciones(dto.getRestricciones());
        entity.setIntentosMax(dto.getIntentosMax());
        entity.setLesson(lesson);
    }

}
