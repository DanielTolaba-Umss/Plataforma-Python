package com.coders.backers.plataformapython.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.coders.backers.plataformapython.backend.models.PracticeEntity;

public interface PracticeRepository extends JpaRepository<PracticeEntity, Long> {
    PracticeEntity findByLessonId(Long lessonId);
}
