package com.coders.backers.plataformapython.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.AllArgsConstructor;

import com.coders.backers.plataformapython.backend.dto.module.CreateModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.UpdateModuleDto;
import com.coders.backers.plataformapython.backend.services.ModuleService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private  ModuleService moduleService;

    // Build the controller methods for CRUD operations
    // Create
    @PostMapping
    public ResponseEntity<ModuleDto> createModule(@RequestBody CreateModuleDto createModuleDto) {
        ModuleDto savedModule = moduleService.createModule(createModuleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModule);
    }

    // Read
    @GetMapping("/{id}")
    public ResponseEntity<ModuleDto> getModuleById(@PathVariable Long id) {
        ModuleDto moduleDto = moduleService.getModuleById(id);
        return ResponseEntity.ok(moduleDto);
    }
    
    @GetMapping
    public ResponseEntity<List<ModuleDto>> getAllModules(
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "title", required = false) String title) {
        
        List<ModuleDto> modules;
        
        if (title != null && !title.isEmpty()) {
            modules = moduleService.searchModulesByTitle(title);
        } else if (active != null && !active) {
            modules = moduleService.getActiveModules();
        } else {
            modules = moduleService.getAllModules();
        }
        
        return ResponseEntity.ok(modules);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ModuleDto> updateModule(
            @PathVariable Long id, 
            @RequestBody UpdateModuleDto updateModuleDto) {
        ModuleDto updatedModule = moduleService.updateModule(id, updateModuleDto);
        return ResponseEntity.ok(updatedModule);
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<ModuleDto> activateModule(@PathVariable Long id) {
        ModuleDto activatedModule = moduleService.activateModule(id);
        return ResponseEntity.ok(activatedModule);
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ModuleDto> deactivateModule(@PathVariable Long id) {
        ModuleDto deactivatedModule = moduleService.deactivateModule(id);
        return ResponseEntity.ok(deactivatedModule);
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}
