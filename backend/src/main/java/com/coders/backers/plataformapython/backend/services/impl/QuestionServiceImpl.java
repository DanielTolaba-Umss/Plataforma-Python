package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.question.*;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.QuestionMapper;
import com.coders.backers.plataformapython.backend.models.QuestionEntity;
import com.coders.backers.plataformapython.backend.models.QuizEntity;
import com.coders.backers.plataformapython.backend.repository.QuestionRepository;
import com.coders.backers.plataformapython.backend.repository.QuizRepository;
import com.coders.backers.plataformapython.backend.services.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Override
    public QuestionDto create(CreateQuestionDto dto) {
        QuizEntity quiz = quizRepository.findById(dto.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + dto.getQuizId()));

        QuestionEntity entity = QuestionMapper.fromCreateDto(dto, quiz);
        return QuestionMapper.toDto(questionRepository.save(entity));
    }

    @Override
    public QuestionDto update(Long id, UpdateQuestionDto dto) {
        QuestionEntity entity = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));

        QuestionMapper.updateEntity(dto, entity);
        return QuestionMapper.toDto(questionRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        QuestionEntity entity = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));
        questionRepository.delete(entity);
    }

    @Override
    public QuestionDto getById(Long id) {
        return questionRepository.findById(id)
                .map(QuestionMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));
    }

    @Override
    public List<QuestionDto> getAll() {
        return questionRepository.findAll().stream()
                .map(QuestionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionDto> getByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream()
                .map(QuestionMapper::toDto)
                .collect(Collectors.toList());
    }
}
