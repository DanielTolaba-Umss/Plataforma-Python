package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContenidoRepository extends JpaRepository<ContenidoModel, Long> {
}
