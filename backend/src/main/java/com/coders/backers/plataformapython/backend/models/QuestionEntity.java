package com.coders.backers.plataformapython.backend.models;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;    // ✅ Hibernate 6.x
import jakarta.persistence.Entity; // ✅ Hibernate 6.x
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @JdbcTypeCode(SqlTypes.JSON)  
    @Column(name = "opciones", columnDefinition = "jsonb")
    private Map<String, String> opciones;

    @Column(name = "respuesta_correcta", nullable = false)
    private String respuestaCorrecta;

    @Column(name = "explicacion", columnDefinition = "TEXT")
    private String explicacion;
}