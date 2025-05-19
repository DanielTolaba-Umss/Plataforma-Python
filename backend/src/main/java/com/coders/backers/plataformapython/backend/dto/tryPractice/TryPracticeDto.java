package com.coders.backers.plataformapython.backend.dto.tryPractice;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TryPracticeDto {
    private Long id;
    private Long practiceId;
    private String codigoEnviado;
    private String resultadosPruebas;
    private boolean aprobado;
    private String retroalimentacion;
    private Date fechaIntento;
}
