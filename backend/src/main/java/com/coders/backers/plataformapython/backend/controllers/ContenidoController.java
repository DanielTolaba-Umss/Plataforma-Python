package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.content.ContenidoDto;
import com.coders.backers.plataformapython.backend.services.ContenidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contenido")
public class ContenidoController {

    private final ContenidoService service;

    public ContenidoController(ContenidoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ContenidoDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContenidoDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ContenidoDto> create(@RequestBody ContenidoDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContenidoDto> update(@PathVariable Long id, @RequestBody ContenidoDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
