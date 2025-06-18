package com.coders.backers.plataformapython.backend.dto.student;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class StudentProfileDto {
    private Long id;
    private String nombreCompleto;
    private String email;
    private String telefono;
    private LocalDate fechaInicio;
    private String nivelActual;
    private int modulosCompletados;
    private int ejerciciosCompletados;
    private String moduloActual;
    private int progresoModuloActual; // 0 - 100
    private int progresoGeneral;      // 0 - 100
    private List<ModuloCompletadoDto> modulosCompletadosDetalles;
}