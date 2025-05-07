package com.coders.backers.plataformapython.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.coders.backers.plataformapython.backend.models.ModuleModel;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository  extends JpaRepository<ModuleModel, Long> {
    List<ModuleModel> findByActive(boolean active);
    List<ModuleModel> findByTitle(String title);
    List<ModuleModel> findByTitleContainingIgnoreCase(String title);
    List<ModuleModel> findByOrdenGreaterThan(int orden);
    List<ModuleModel> findByTitleIn(List<String> titles);


    boolean existsByTitle(String title);
}
