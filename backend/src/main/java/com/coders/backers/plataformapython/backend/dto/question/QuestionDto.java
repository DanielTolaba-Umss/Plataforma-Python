package com.coders.backers.plataformapython.backend.dto.question;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private Long id;
    private Long quizId;
    private String textoPregunta;
    private String tipoPregunta;
    private Integer puntos;
    private Map<String, String> opciones;
    private String respuestaCorrecta;
    private String explicacion;
}
