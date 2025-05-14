package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "multimedia_content")
public class MultimediaContentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String tipo;
    private String titulo;
    private String descripcion;
    private String url;

    @Lob
    private byte[] archivo; 

    private double duracion;
    private int orden;
    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "leccion_id")
    private LessonEntity leccion; 


    public MultimediaContentModel() {
    }


    public MultimediaContentModel(Long id, String tipo, String titulo, String descripcion, String url,
                                  byte[] archivo, double duracion, int orden, boolean activo, LessonEntity leccion) {
        this.id = id;
        this.tipo = tipo;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.url = url;
        this.archivo = archivo;
        this.duracion = duracion;
        this.orden = orden;
        this.activo = activo;
        this.leccion = leccion;
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public byte[] getArchivo() {
        return archivo;
    }

    public void setArchivo(byte[] archivo) {
        this.archivo = archivo;
    }

    public double getDuracion() {
        return duracion;
    }

    public void setDuracion(double duracion) {
        this.duracion = duracion;
    }

    public int getOrden() {
        return orden;
    }

    public void setOrden(int orden) {
        this.orden = orden;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public LessonEntity getLeccion() {
        return leccion;
    }

    public void setLesson(LessonEntity leccion) {
        this.leccion = leccion;
    }
}
