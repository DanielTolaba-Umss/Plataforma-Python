package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceTypeRepository extends JpaRepository<ResourceTypeModel, Long> {
}
