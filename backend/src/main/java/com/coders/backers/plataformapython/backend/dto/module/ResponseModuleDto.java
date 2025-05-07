package com.coders.backers.plataformapython.backend.dto.module;

import com.coders.backers.plataformapython.backend.models.ModuleModel;

public class ResponseModuleDto {
    private Long id;
    private String title;
    private String description;
    private Integer orden;
    private boolean active; 

    public ResponseModuleDto(ModuleModel moduleModel) {
        this.id = moduleModel.getId();
        this.title = moduleModel.getTitle();
        this.description = moduleModel.getDescription();
        this.orden = moduleModel.getOrden();
        this.active = moduleModel.getActive();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
    
    public Integer getOrden() {
        return orden;
    }

    public boolean isActive() {
        return active;
    }
}
