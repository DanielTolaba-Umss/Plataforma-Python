package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.ResourceModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<ResourceModel, Long> {
}
