package com.coders.backers.plataformapython.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentLessonDto {
    private Long lessonId;
    private String title;
    private String description;
    private Long courseId;
    private String courseTitle;
    private boolean completed;
    private LocalDate completionDate;
    private LocalDate startDate;
    private Integer timeSpentMinutes;
    private Integer practiceAttempts;
    private Double bestPracticeScore;
    private Double lastPracticeScore;
    private boolean practiceCompleted;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
}
