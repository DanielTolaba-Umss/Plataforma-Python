package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.quiz.CreateQuizDto;
import com.coders.backers.plataformapython.backend.dto.quiz.QuizDto;
import com.coders.backers.plataformapython.backend.dto.quiz.UpdateQuizDto;

public interface QuizService {
    QuizDto createQuiz(CreateQuizDto dto);

    QuizDto updateQuiz(Long id, UpdateQuizDto dto);

    List<QuizDto> getAllQuizzes();

    void deleteQuiz(Long id);

    void descontarIntento(Long quizId);

}
