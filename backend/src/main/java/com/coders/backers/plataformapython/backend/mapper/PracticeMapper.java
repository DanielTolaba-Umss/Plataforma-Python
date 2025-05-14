package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.practice.*;
import com.coders.backers.plataformapython.backend.models.*;

public class PracticeMapper {

    public static PracticeModuleDto toDto(PracticeModule entity) {
        PracticeModuleDto dto = new PracticeModuleDto();
        dto.setId(entity.getId());
        dto.setInstrucciones(entity.getInstrucciones());
        dto.setCodigoInicial(entity.getCodigoInicial());
        dto.setSolucionReferencia(entity.getSolucionReferencia());
        dto.setCasosPrueba(entity.getCasosPrueba());
        dto.setRestricciones(entity.getRestricciones());
        dto.setIntentosMax(entity.getIntentosMax());
        if (entity.getLesson() != null) {
            dto.setLeccionId(entity.getLesson().getId());
        }
        return dto;
    }

    public static PracticeModule fromCreateDto(CreatePracticeModuleDto dto, LessonModel lesson) {
        PracticeModule entity = new PracticeModule();
        entity.setInstrucciones(dto.getInstrucciones());
        entity.setCodigoInicial(dto.getCodigoInicial());
        entity.setSolucionReferencia(dto.getSolucionReferencia());
        entity.setCasosPrueba(dto.getCasosPrueba());
        entity.setRestricciones(dto.getRestricciones());
        entity.setIntentosMax(dto.getIntentosMax());
        entity.setLesson(lesson);
        return entity;
    }
}
