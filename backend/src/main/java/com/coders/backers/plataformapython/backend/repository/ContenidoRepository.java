package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContenidoRepository extends JpaRepository<ContenidoModel, Long> {
    List<ContenidoModel> findByLeccion(LessonEntity leccion);
}
