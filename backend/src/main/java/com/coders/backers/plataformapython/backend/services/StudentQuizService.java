package com.coders.backers.plataformapython.backend.services;

/*
 * SERVICIO COMENTADO - NO SE UTILIZA EN EL CÁLCULO DE PROGRESO
 * El progreso del curso ahora se basa únicamente en lecciones completadas.
 * Los quizzes y prácticas no contribuyen al progreso total.
 * 
 * Esta interfaz ha sido comentada para evitar errores de compilación
 * relacionados con clases faltantes (StudentQuizStatusDto, StudentQuizAttemptEntity).
 */

// import com.coders.backers.plataformapython.backend.dto.student.StudentQuizStatusDto;
// import com.coders.backers.plataformapython.backend.models.StudentQuizAttemptEntity;
// import java.util.List;

/*
public interface StudentQuizService {
    StudentQuizStatusDto getQuizStatus(String userEmail, Long quizId);
    List<StudentQuizStatusDto> getCourseQuizzesStatus(String userEmail, Long courseId);
    StudentQuizAttemptEntity startQuizAttempt(String userEmail, Long quizId);
    StudentQuizAttemptEntity completeQuizAttempt(String userEmail, Long attemptId, 
                                                 Integer score, Boolean passed, 
                                                 String answers, Integer correctAnswers, 
                                                 Integer totalQuestions, Integer timeTaken);
    boolean canAttemptQuiz(String userEmail, Long quizId);
    Double getQuizProgressPercentage(String userEmail, Long courseId);
}
*/
