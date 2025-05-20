package com.coders.backers.plataformapython.backend.dto.quiz;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuizDto {
    private String titulo;
    private String descripcion;
    private Integer duracionMinutos;
    private Integer intentosPermitidos;
    private Integer puntuacionAprobacion;
    private boolean aleatorio;
    private boolean active;
    private Long contenidoId;
}
