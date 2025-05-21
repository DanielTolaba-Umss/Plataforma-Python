package com.coders.backers.plataformapython.backend.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLessonDto {
    private String title;
    private String description;
    private Long courseId;
    private Long quizId;
    private Long practiceId;
}