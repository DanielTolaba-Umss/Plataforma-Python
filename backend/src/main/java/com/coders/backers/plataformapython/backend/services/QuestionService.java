package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.question.*;

import java.util.List;

public interface QuestionService {
    QuestionDto create(CreateQuestionDto dto);
    QuestionDto update(Long id, UpdateQuestionDto dto);
    void delete(Long id);
    QuestionDto getById(Long id);
    List<QuestionDto> getAll();
    List<QuestionDto> getByQuizId(Long quizId);
}
