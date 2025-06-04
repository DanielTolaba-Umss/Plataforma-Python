package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.QuizEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<QuizEntity, Long> {
}
