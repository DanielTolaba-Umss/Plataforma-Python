package com.coders.backers.plataformapython.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.Getter;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MultimediaContentDTO {
    private Long id;
    private String tipo;
    private String titulo;
    private String descripcion;
    private String url;
    private double duracion;
    private int orden;
    private boolean activo;
    private Long leccionId;

}
