package com.coders.backers.plataformapython.backend.dto.lesson;

import lombok.Data;

@Data
public class LessonDTO {
    private Long id;
    private String titulo;
    private String contenido;
    private boolean activo;
    private Long moduloId;
}