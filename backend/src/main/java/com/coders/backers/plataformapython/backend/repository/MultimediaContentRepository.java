package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.MultimediaContentModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MultimediaContentRepository extends JpaRepository<MultimediaContentModel, Long> {
}
