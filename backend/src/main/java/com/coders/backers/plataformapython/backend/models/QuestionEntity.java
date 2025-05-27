package com.coders.backers.plataformapython.backend.models;

import com.coders.backers.plataformapython.backend.config.MapToJsonConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "question")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quiz_id", referencedColumnName = "quiz_id")
    private QuizEntity quiz;

    @Column(name = "texto_pregunta", columnDefinition = "TEXT", nullable = false)
    private String textoPregunta;

    @Column(name = "tipo_pregunta", length = 50, nullable = false)
    private String tipoPregunta;

    @Column(name = "puntos", nullable = false)
    private Integer puntos;

    @Convert(converter = MapToJsonConverter.class)
    @Column(name = "opciones", columnDefinition = "jsonb")
    private Map<String, String> opciones;

    @Column(name = "respuesta_correcta", nullable = false)
    private String respuestaCorrecta;

    @Column(name = "explicacion", columnDefinition = "TEXT")
    private String explicacion;
}
