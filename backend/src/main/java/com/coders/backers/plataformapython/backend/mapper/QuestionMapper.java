package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.question.*;
import com.coders.backers.plataformapython.backend.models.QuestionEntity;
import com.coders.backers.plataformapython.backend.models.QuizEntity;

public class QuestionMapper {

    public static QuestionEntity fromCreateDto(CreateQuestionDto dto, QuizEntity quiz) {
        return new QuestionEntity(
                null,
                quiz,
                dto.getTextoPregunta(),
                dto.getTipoPregunta(),
                dto.getPuntos(),
                dto.getOpciones(),
                dto.getRespuestaCorrecta(),
                dto.getExplicacion()
        );
    }

    public static QuestionDto toDto(QuestionEntity entity) {
        return new QuestionDto(
                entity.getId(),
                entity.getQuiz().getId(),
                entity.getTextoPregunta(),
                entity.getTipoPregunta(),
                entity.getPuntos(),
                entity.getOpciones(),
                entity.getRespuestaCorrecta(),
                entity.getExplicacion()
        );
    }

    public static void updateEntity(UpdateQuestionDto dto, QuestionEntity entity) {
        entity.setTextoPregunta(dto.getTextoPregunta());
        entity.setTipoPregunta(dto.getTipoPregunta());
        entity.setPuntos(dto.getPuntos());
        entity.setOpciones(dto.getOpciones());
        entity.setRespuestaCorrecta(dto.getRespuestaCorrecta());
        entity.setExplicacion(dto.getExplicacion());
    }
}
