package com.coders.backers.plataformapython.backend.dto.module;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateModuleDto {
    private String title;
    private String description;
    private int orden; 
}
