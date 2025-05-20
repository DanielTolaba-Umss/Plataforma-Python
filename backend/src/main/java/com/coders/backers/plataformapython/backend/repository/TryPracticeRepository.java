package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TryPracticeRepository extends JpaRepository<TryPracticeEntity, Long> {
    List<TryPracticeEntity> findByPractice_Id(Long practiceId);
}

