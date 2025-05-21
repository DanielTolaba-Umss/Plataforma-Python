package com.coders.backers.plataformapython.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateStudentDto {
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String ciudad;
    private String password;
    private List<Long> cursos;
}
