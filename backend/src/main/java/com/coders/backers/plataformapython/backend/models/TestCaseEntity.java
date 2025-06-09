package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_case")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "practice_id", referencedColumnName = "id")
    private PracticeEntity practice;

    private String entrada;
    private String salida;
    @Column(name="entrada_test_case")
    private String entradaTestCase;
}
