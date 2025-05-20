package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "try_practice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TryPracticeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "intento_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "practica_id", referencedColumnName = "id")
    private PracticeEntity practice;

    @Column(name = "codigoenviado", columnDefinition = "TEXT")
    private String codigoEnviado;

    @Column(name = "resultados_pruebas", columnDefinition = "TEXT")
    private String resultadosPruebas;

    @Column(name = "aprobado")
    private boolean aprobado;

    @Column(name = "retroalimentacion")
    private String retroalimentacion;

    @Column(name = "fecha_intento")
    private Date fechaIntento;
}
