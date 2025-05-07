package com.coders.backers.plataformapython.backend.dto.module;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StoreModuleDto {

    @NotBlank(message = "El titulo no puede estar vacio")
    private String title;

    @NotBlank(message = "La descripcion no puede estar vacia")
    private String description;

    @NotNull(message = "Orden no puede ser nulo")
    @Positive(message = "Debe ser un numero positivo")
    private int orden;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getOrden() {
        return orden;
    }

    public void setOrden(int orden) {
        this.orden = orden;
    }

}
