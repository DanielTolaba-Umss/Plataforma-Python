package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.question.*;
import com.coders.backers.plataformapython.backend.services.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionDto> create(@RequestBody CreateQuestionDto dto) {
        return ResponseEntity.ok(questionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> update(@PathVariable Long id, @RequestBody UpdateQuestionDto dto) {
        return ResponseEntity.ok(questionService.update(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAll() {
        return ResponseEntity.ok(questionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getById(id));
    }

    @GetMapping("/by-quiz/{quizId}")
    public ResponseEntity<List<QuestionDto>> getByQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(questionService.getByQuizId(quizId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
