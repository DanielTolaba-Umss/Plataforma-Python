package com.coders.backers.plataformapython.backend.dto.tryPractice;

import lombok.*;

import java.time.LocalDateTime;

import com.coders.backers.plataformapython.backend.dto.practice.PracticeDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TryPracticeDto {
    private Long id;
    private StudentDto student;
    private PracticeDto practice;
    private String code;
    private String testResults;
    private Boolean approved;
    private String feedback;
    private LocalDateTime createAt;
}
