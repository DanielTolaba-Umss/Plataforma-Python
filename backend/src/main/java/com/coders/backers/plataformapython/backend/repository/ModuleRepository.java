package com.coders.backers.plataformapython.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

import com.coders.backers.plataformapython.backend.models.ModuleEntity;



@Repository
public interface ModuleRepository  extends JpaRepository<ModuleEntity, Long> {
    List<ModuleEntity> findByActive(boolean active);
    List<ModuleEntity> findByTitle(String title);
    List<ModuleEntity> findByTitleContainingIgnoreCase(String title);
    List<ModuleEntity> findByOrdenGreaterThan(int orden);

    boolean existsByTitle(String title);
}
