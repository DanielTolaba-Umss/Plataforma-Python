package com.coders.backers.plataformapython.backend.dto.student;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ModuloCompletadoDto {
    private String titulo;
    private int porcentaje;
    private LocalDate fechaFinalizacion;
}