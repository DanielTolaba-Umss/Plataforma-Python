package com.coders.backers.plataformapython.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {
    private Long id;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private LocalDate fechaRegistro;
    private boolean activo;
    private String role;
}
