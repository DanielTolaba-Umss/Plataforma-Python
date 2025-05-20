package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.quiz.*;
import java.util.List;

public interface QuizService {
    QuizDto createQuiz(CreateQuizDto dto);
    QuizDto updateQuiz(Long id, UpdateQuizDto dto);
    List<QuizDto> getAllQuizzes();
    void deleteQuiz(Long id);
}