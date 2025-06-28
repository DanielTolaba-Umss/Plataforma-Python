package com.coders.backers.plataformapython.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseDto {
    private Long courseId;
    private String title;
    private String level;
    private String description;
    private int progreso; // Porcentaje de progreso (0-100)
    private LocalDate fechaInscripcion;
    private boolean completado;
    private int leccionesTotales;
    private int leccionesCompletadas;
    private boolean quizCompletado;
    private Integer quizScore;
    private Integer bestQuizScore;
    private Integer quizAttempts;
    private int progresoLecciones; // Progreso específico de lecciones (0-100) - determina el progreso total del curso
    private int progresoQuiz; // Progreso específico del quiz (no contribuye al progreso del curso)
}
