package com.coders.backers.plataformapython.backend.dto.practice;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePracticeDto {
    private String instrucciones;
    private String codigoInicial;
    private String solucionReferencia;
    private String restricciones;
    private Integer intentosMax;
    private Long leccionId;
}
