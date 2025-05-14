package com.coders.backers.plataformapython.backend.utils;

import com.coders.backers.plataformapython.backend.models.ModuleEntity;

public class ModuleValidator {
    public void validate(ModuleEntity module){
        if (module.getTitle() == null || module.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Module title cannot be null or empty");
        }
        if (module.getDescription() == null || module.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Module description cannot be null or empty");
        }
        if (module.getOrden() < 0) {
            throw new IllegalArgumentException("Module order cannot be negative");
        }
    }
}
