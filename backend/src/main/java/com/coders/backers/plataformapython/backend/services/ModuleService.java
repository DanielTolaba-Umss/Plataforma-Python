package com.coders.backers.plataformapython.backend.services;

import java.util.List;

import com.coders.backers.plataformapython.backend.dto.module.CreateModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.UpdateModuleDto;

public interface ModuleService {


    ModuleDto createModule(CreateModuleDto createModuleDto);
    

    ModuleDto getModuleById(Long id);
    List<ModuleDto> getAllModules();
    List<ModuleDto> getActiveModules();
    

    ModuleDto updateModule(Long id, UpdateModuleDto updateModuleDto);
    ModuleDto activateModule(Long id);
    ModuleDto deactivateModule(Long id);

    void deleteModule(Long id);
    

    List<ModuleDto> searchModulesByTitle(String title);
} 