package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;

public class TryPracticeMapper {

    public static TryPracticeEntity mapFromCreateDto(CreateTryPracticeDto dto) {
        return new TryPracticeEntity(
            null,
            dto.getPracticeId(),
            dto.getCodigoEnviado(),
            dto.getResultadosPruebas(),
            dto.isAprobado(),
            dto.getRetroalimentacion(),
            dto.getFechaIntento()
        );
    }

    public static TryPracticeDto mapToDto(TryPracticeEntity entity) {
        return new TryPracticeDto(
            entity.getId(),
            entity.getPracticeId(),
            entity.getCodigoEnviado(),
            entity.getResultadosPruebas(),
            entity.isAprobado(),
            entity.getRetroalimentacion(),
            entity.getFechaIntento()
        );
    }

    public static void mapFromUpdateDto(UpdateTryPracticeDto dto, TryPracticeEntity entity) {
        entity.setCodigoEnviado(dto.getCodigoEnviado());
        entity.setResultadosPruebas(dto.getResultadosPruebas());
        entity.setAprobado(dto.isAprobado());
        entity.setRetroalimentacion(dto.getRetroalimentacion());
        entity.setFechaIntento(dto.getFechaIntento());
    }
}
