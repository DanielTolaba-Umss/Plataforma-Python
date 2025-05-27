package com.coders.backers.plataformapython.backend.dto.lesson;

import java.sql.Date;

import com.coders.backers.plataformapython.backend.dto.course.CourseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
//solucionar errores commit
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private Long id;
    private String title;
    private String description;
    private boolean active; 
    private Date createdAt;
    private Date updatedAt;
    private CourseDto course;
    private Long quizId;
    private Long practiceId;
}

