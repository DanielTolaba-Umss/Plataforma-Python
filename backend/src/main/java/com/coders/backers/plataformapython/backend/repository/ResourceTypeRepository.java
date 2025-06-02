package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceTypeRepository extends JpaRepository<ResourceTypeModel, Long> {}
