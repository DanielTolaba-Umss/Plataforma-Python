package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "practice")
public class PracticeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

     @Column(name = "instrucciones", columnDefinition = "TEXT")
    private String instrucciones;

    private String codigoInicial;
    private String solucionReferencia;

     @Column(name = "restricciones", columnDefinition = "TEXT")
    private String restricciones;
    
    private Integer intentosMax;

    @OneToOne
    @JoinColumn(name = "leccion_id")
    private LessonEntity lesson;

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCaseEntity> testCases = new ArrayList<>();

    public PracticeEntity() {}

    public PracticeEntity(Long id, String instrucciones, String codigoInicial, String solucionReferencia, String restricciones, Integer intentosMax) {
        this.id = id;
        this.instrucciones = instrucciones;
        this.codigoInicial = codigoInicial;
        this.solucionReferencia = solucionReferencia;
        this.restricciones = restricciones;
        this.intentosMax = intentosMax;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInstrucciones() {
        return instrucciones;
    }

    public void setInstrucciones(String instrucciones) {
        this.instrucciones = instrucciones;
    }

    public String getCodigoInicial() {
        return codigoInicial;
    }

    public void setCodigoInicial(String codigoInicial) {
        this.codigoInicial = codigoInicial;
    }

    public String getSolucionReferencia() {
        return solucionReferencia;
    }

    public void setSolucionReferencia(String solucionReferencia) {
        this.solucionReferencia = solucionReferencia;
    }

    public String getRestricciones() {
        return restricciones;
    }

    public void setRestricciones(String restricciones) {
        this.restricciones = restricciones;
    }

    public Integer getIntentosMax() {
        return intentosMax;
    }

    public void setIntentosMax(Integer intentosMax) {
        this.intentosMax = intentosMax;
    }

    public LessonEntity getLesson() {
        return lesson;
    }

    public void setLesson(LessonEntity lesson) {
        this.lesson = lesson;
    }

    public List<TestCaseEntity> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCaseEntity> testCases) {
        this.testCases = testCases;
    }
}