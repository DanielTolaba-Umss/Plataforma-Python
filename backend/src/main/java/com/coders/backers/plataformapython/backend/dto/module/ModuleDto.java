package com.coders.backers.plataformapython.backend.dto.module;

import java.sql.Date;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDto {
    private Long id;
    private String title;
    private String description;
    private int orden;
    private Date createdAt;
    private Date updatedAt;
    private boolean active;
}
