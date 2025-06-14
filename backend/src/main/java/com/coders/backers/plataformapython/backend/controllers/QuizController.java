package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.quiz.*;
import com.coders.backers.plataformapython.backend.services.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<QuizDto> createQuiz(@RequestBody CreateQuizDto dto) {
        return ResponseEntity.status(201).body(quizService.createQuiz(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDto> updateQuiz(@PathVariable Long id, @RequestBody UpdateQuizDto dto) {
        return ResponseEntity.ok(quizService.updateQuiz(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<QuizDto>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}/descontar-intento")
    public ResponseEntity<?> descontarIntento(@PathVariable Long id) {
    quizService.descontarIntento(id);
    return ResponseEntity.ok("Intento descontado");
}

}
