package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<QuestionEntity, Long> {
    List<QuestionEntity> findByQuizId(Long quizId);
}
