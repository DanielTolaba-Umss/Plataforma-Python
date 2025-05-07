package com.coders.backers.plataformapython.backend.dto.course;


import lombok.Data;
import java.util.List;

@Data
public class CourseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private boolean activo;
    private List<Long> modulos; // IDs de módulos relacionados
}