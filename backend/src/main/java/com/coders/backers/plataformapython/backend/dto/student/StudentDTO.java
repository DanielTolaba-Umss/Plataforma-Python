package com.coders.backers.plataformapython.backend.dto.student;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String ciudad;
    private String pais;
    private boolean activo;
    private LocalDate fechaInicio;
    private List<Long> cursos; // Lista de IDs de cursos
    private String password;   // para creación, no se devuelve en respuestas

    // Constructor sin password para respuestas
    public StudentDTO(Long id, String nombres, String apellidos, String email, String telefono,
                      String ciudad, String pais, boolean activo, LocalDate fechaInicio, List<Long> cursos) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.email = email;
        this.telefono = telefono;
        this.ciudad = ciudad;
        this.pais = pais;
        this.activo = activo;
        this.fechaInicio = fechaInicio;
        this.cursos = cursos;
    }
}