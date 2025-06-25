package com.coders.backers.plataformapython.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProgressDto {
    private String nivelActual;
    private int leccionesCompletadas;
    private int certificacionesObtenidas;
    private int cursosInscritos;
    private int cursosCompletados;
    private List<StudentCourseDto> cursosActivos;
    private int progresoGeneral; // Porcentaje general de todos los cursos
}
