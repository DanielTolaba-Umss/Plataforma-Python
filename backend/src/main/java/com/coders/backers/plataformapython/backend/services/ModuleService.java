package com.coders.backers.plataformapython.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coders.backers.plataformapython.backend.repository.ModuleRepository;

import jakarta.persistence.EntityNotFoundException;

import com.coders.backers.plataformapython.backend.dto.module.ResponseModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.StoreModuleDto;
import com.coders.backers.plataformapython.backend.models.ModuleModel;


@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public ModuleModel createModule(StoreModuleDto storeModuleDto) {

        if (moduleRepository.existsByTitle(storeModuleDto.getTitle())) {
            throw new IllegalArgumentException("A module with this title already exists.");
        }

        ModuleModel module = new ModuleModel();
        module.setTitle(storeModuleDto.getTitle());
        module.setDescription(storeModuleDto.getDescription());
        module.setOrden(storeModuleDto.getOrden());
        module.setActive(true);

        return moduleRepository.save(module);
    }


    public List<ResponseModuleDto> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(ResponseModuleDto::new)
                .collect(Collectors.toList());
    }

    public ResponseModuleDto getModuleById(Long id) {
        ModuleModel moduleModel = moduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontro el modulo con id: " + id));
        return new ResponseModuleDto(moduleModel);
    }
    
}
