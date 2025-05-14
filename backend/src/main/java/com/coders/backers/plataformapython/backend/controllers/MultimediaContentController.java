package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.multimedia.MultimediaContentDTO;
import com.coders.backers.plataformapython.backend.services.MultimediaContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/multimedia")
public class MultimediaContentController {

    private final MultimediaContentService contentService;

    public MultimediaContentController(MultimediaContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MultimediaContentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<MultimediaContentDTO>> getAll() {
        return ResponseEntity.ok(contentService.getAll());
    }

    @PostMapping
    public ResponseEntity<MultimediaContentDTO> create(@RequestBody MultimediaContentDTO dto) {
        return ResponseEntity.ok(contentService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MultimediaContentDTO> update(@PathVariable Long id, @RequestBody MultimediaContentDTO dto) {
        return ResponseEntity.ok(contentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
