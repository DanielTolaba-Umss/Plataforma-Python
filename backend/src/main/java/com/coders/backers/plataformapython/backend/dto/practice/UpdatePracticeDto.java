package com.coders.backers.plataformapython.backend.dto.practice;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePracticeDto {
    private String instrucciones;
    private String codigoInicial;
    private String solucionReferencia;
    private String casosPrueba;
    private String restricciones;
    private Integer intentosMax;
    private Long leccionId;
}