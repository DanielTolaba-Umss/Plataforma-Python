package com.coders.backers.plataformapython.backend.dto.resources;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResourceDto {

    private Long resourceId;
    private Long contentId;
    private Long typeId;
    private String url;
    private String title;
    private String sourceType;
    private String source;

   
}
