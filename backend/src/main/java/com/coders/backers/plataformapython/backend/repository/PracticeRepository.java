package com.coders.backers.plataformapython.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.coders.backers.plataformapython.backend.models.PracticeModule;

public interface PracticeRepository extends JpaRepository<PracticeModule, Long> {
}
