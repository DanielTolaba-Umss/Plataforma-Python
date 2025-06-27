package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "practice")
public class PracticeEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String instrucciones;
    
    @Column(columnDefinition = "TEXT")
    private String codigoInicial;
    
    @Column(columnDefinition = "TEXT")
    private String solucionReferencia;
    
    @Column(columnDefinition = "TEXT")
    private String restricciones;
    
    private Integer intentosMax;

    @OneToOne
    @JoinColumn(name = "leccion_id")
    private LessonEntity lesson;

    // Relación con TestCases - eliminación en cascada
    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCaseEntity> testCases = new ArrayList<>();

    // Relación con TryPractice - eliminación en cascada
    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TryPracticeEntity> tryPractices = new ArrayList<>();

    public PracticeEntity() {
    }

    public PracticeEntity(Long id, String instrucciones, String codigoInicial, String solucionReferencia,
            String restricciones, Integer intentosMax) {
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

    public List<TryPracticeEntity> getTryPractices() {
        return tryPractices;
    }

    public void setTryPractices(List<TryPracticeEntity> tryPractices) {
        this.tryPractices = tryPractices;
    }

    public PracticeEntity orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }
}
