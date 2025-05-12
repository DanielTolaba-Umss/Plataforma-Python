package com.coders.backers.plataformapython.backend.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coders.backers.plataformapython.backend.dto.module.CreateModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.UpdateModuleDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.ModuleMapper;
import com.coders.backers.plataformapython.backend.models.ModuleEntity;
import com.coders.backers.plataformapython.backend.repository.ModuleRepository;
import com.coders.backers.plataformapython.backend.services.ModuleService;

import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    private ModuleRepository moduleRepository;

    @Override
    public ModuleDto createModule(CreateModuleDto createModuleDto) {
        ModuleEntity moduleEntity = ModuleMapper.mapFromCreateDto(createModuleDto);
        ModuleEntity savedModule = moduleRepository.save(moduleEntity);
        return ModuleMapper.mapToModelDto(savedModule);
    }

    @Override
    public ModuleDto getModuleById(Long id) {
        ModuleEntity moduleEntity = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado con id: " + id));
        return ModuleMapper.mapToModelDto(moduleEntity);
    }
    
    @Override
    public List<ModuleDto> getAllModules() {
        List<ModuleEntity> modules = moduleRepository.findAll();
        return modules.stream()
            .map(ModuleMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ModuleDto> getActiveModules() {
        List<ModuleEntity> activeModules = moduleRepository.findByActive(false);
        return activeModules.stream()
            .map(ModuleMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public ModuleDto updateModule(Long id, UpdateModuleDto updateModuleDto) {
        ModuleEntity moduleEntity = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado con id: " + id));
            
        moduleEntity.setTitle(updateModuleDto.getTitle());
        moduleEntity.setDescription(updateModuleDto.getDescription());
        moduleEntity.setOrden(updateModuleDto.getOrden());

        ModuleEntity updatedModule = moduleRepository.save(moduleEntity);
        return ModuleMapper.mapToModelDto(updatedModule);
    }
    
    @Override
    public ModuleDto activateModule(Long id) {
        ModuleEntity moduleEntity = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado con id: " + id));
            
        moduleEntity.setActive(true);
        ModuleEntity updatedModule = moduleRepository.save(moduleEntity);
        return ModuleMapper.mapToModelDto(updatedModule);
    }
    
    @Override
    public ModuleDto deactivateModule(Long id) {
        ModuleEntity moduleEntity = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado con id: " + id));
            
        moduleEntity.setActive(false);
        ModuleEntity updatedModule = moduleRepository.save(moduleEntity);
        return ModuleMapper.mapToModelDto(updatedModule);
    }
    
    @Override
    public void deleteModule(Long id) {
        ModuleEntity moduleEntity = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado con id: " + id));
            
        moduleRepository.delete(moduleEntity);
    }
    
    @Override
    public List<ModuleDto> searchModulesByTitle(String title) {
        List<ModuleEntity> modules = moduleRepository.findByTitleContainingIgnoreCase(title);
        return modules.stream()
            .map(ModuleMapper::mapToModelDto)
            .collect(Collectors.toList());
    }

}
