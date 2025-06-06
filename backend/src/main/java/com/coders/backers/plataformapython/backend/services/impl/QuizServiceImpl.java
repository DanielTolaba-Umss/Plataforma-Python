package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.quiz.*;
import com.coders.backers.plataformapython.backend.mapper.QuizMapper;
import com.coders.backers.plataformapython.backend.models.*;
import com.coders.backers.plataformapython.backend.repository.*;
import com.coders.backers.plataformapython.backend.services.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;

    @Override
    public QuizDto createQuiz(CreateQuizDto dto) {
        CourseEntity cours = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Nivel no encontrado"));
        QuizEntity quiz = QuizMapper.fromCreateDto(dto, cours);
        return QuizMapper.toDto(quizRepository.save(quiz));
    }

    @Override
    public QuizDto updateQuiz(Long id, UpdateQuizDto dto) {
        QuizEntity quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz no encontrado"));
        CourseEntity cours = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Nivel no encontrado"));
        QuizMapper.updateEntityFromDto(dto, quiz, cours);
        return QuizMapper.toDto(quizRepository.save(quiz));
    }

    @Override
    public List<QuizDto> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(QuizMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
