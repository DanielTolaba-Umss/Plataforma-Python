package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.PdfEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfRepository extends JpaRepository<PdfEntity, Long> {
}