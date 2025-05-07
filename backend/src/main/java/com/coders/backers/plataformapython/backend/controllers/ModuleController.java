package com.coders.backers.plataformapython.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.coders.backers.plataformapython.backend.dto.module.ResponseModuleDto;
import com.coders.backers.plataformapython.backend.dto.module.StoreModuleDto;
import com.coders.backers.plataformapython.backend.models.ModuleModel;
import com.coders.backers.plataformapython.backend.services.ModuleService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final ModuleService moduleService;


    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }


    @GetMapping
    public ResponseEntity<List<ResponseModuleDto>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseModuleDto> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PostMapping("/")
    public ResponseEntity<?> create(@Valid @RequestBody StoreModuleDto dto) {
        ModuleModel saved = moduleService.createModule(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    

    
}
