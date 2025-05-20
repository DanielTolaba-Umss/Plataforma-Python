package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.models.PracticeEntity;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;

public class TryPracticeMapper {

    public static TryPracticeEntity fromCreateDto(CreateTryPracticeDto dto, PracticeEntity practice) {
        TryPracticeEntity entity = new TryPracticeEntity();
        entity.setPractice(practice);
        entity.setCodigoEnviado(dto.getCodigoEnviado());
        entity.setResultadosPruebas(dto.getResultadosPruebas());
        entity.setAprobado(dto.isAprobado());
        entity.setRetroalimentacion(dto.getRetroalimentacion());
        entity.setFechaIntento(dto.getFechaIntento());
        return entity;
    }

    public static TryPracticeDto toDto(TryPracticeEntity entity) {
        return new TryPracticeDto(
                entity.getId(),
                entity.getPractice().getId(),
                entity.getCodigoEnviado(),
                entity.getResultadosPruebas(),
                entity.isAprobado(),
                entity.getRetroalimentacion(),
                entity.getFechaIntento()
        );
    }

    public static void updateEntity(UpdateTryPracticeDto dto, TryPracticeEntity entity, PracticeEntity practice) {
        entity.setPractice(practice); 
        entity.setCodigoEnviado(dto.getCodigoEnviado());
        entity.setResultadosPruebas(dto.getResultadosPruebas());
        entity.setAprobado(dto.isAprobado());
        entity.setRetroalimentacion(dto.getRetroalimentacion());
        entity.setFechaIntento(dto.getFechaIntento());
    }
}
