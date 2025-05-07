package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.module.CreateModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.UpdateModuleDto;

public interface ModuleService {

    // Create
    ModuleDto createModule(CreateModuleDto createModuleDto);
    
    // Read
    ModuleDto getModuleById(Long id);
    List<ModuleDto> getAllModules();
    List<ModuleDto> getActiveModules();
    
    // Update
    ModuleDto updateModule(Long id, UpdateModuleDto updateModuleDto);
    ModuleDto activateModule(Long id);
    ModuleDto deactivateModule(Long id);
    
    // Delete
    void deleteModule(Long id);
    
    // Búsqueda
    List<ModuleDto> searchModulesByTitle(String title);


} 