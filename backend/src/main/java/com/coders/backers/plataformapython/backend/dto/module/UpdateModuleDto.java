package com.coders.backers.plataformapython.backend.dto.module;

import com.coders.backers.plataformapython.backend.models.ModuleEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateModuleDto {
    private String title;
    private String description;
    private int orden;
}
