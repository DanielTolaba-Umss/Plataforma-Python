package com.coders.backers.plataformapython.backend.dto.student;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ModuloCompletadoDto {
    private String nombreModulo;
    private int porcentajeCompletado;  // 0-100
    private LocalDate fechaCompletado;
}