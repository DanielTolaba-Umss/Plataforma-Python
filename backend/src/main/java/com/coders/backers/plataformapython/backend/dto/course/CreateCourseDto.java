package com.coders.backers.plataformapython.backend.dto.course;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseDto {
    private String title;
    private String description;
    private String level;
    private int orden;
}