package com.coders.backers.plataformapython.backend.models;

import java.util.ArrayList;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "quiz")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private Long id;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "duracion_minutos")
    private Integer duracionMinutos;

    @Column(name = "intentos_permitidos")
    private Integer intentosPermitidos;

    @Column(name = "puntuacion_aprobacion")
    private Integer puntuacionAprobacion;

    @Column(name = "aleatorio")
    private boolean aleatorio = false;

    @Column(name = "active")
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CourseEntity course;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionEntity> preguntas = new ArrayList<>();

}