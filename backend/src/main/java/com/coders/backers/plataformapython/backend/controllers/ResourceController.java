package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;
import com.coders.backers.plataformapython.backend.models.ResourceModel;
import com.coders.backers.plataformapython.backend.services.ResourceService;
import com.coders.backers.plataformapython.backend.services.impl.FileStorageService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;
    private final FileStorageService fileStorageService;

    public ResourceController(ResourceService resourceService, FileStorageService fileStorageService) {
        this.resourceService = resourceService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResourceDto> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("contentId") Long contentId,
            @RequestParam("typeId") Long typeId) {

        try {
            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
            String uploadDir = "uploads/videos";
            Path filePath = Paths.get(uploadDir, uniqueFilename);

            Files.createDirectories(filePath.getParent());

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            ResourceDto dto = new ResourceDto();
            dto.setTitle(title);
            dto.setContentId(contentId);
            dto.setTypeId(typeId);
            dto.setUrl("/uploads/" + uniqueFilename); 

            ResourceDto saved = resourceService.create(dto);

            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<ResourceDto> create(@RequestBody ResourceDto dto) {
        return ResponseEntity.ok(resourceService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAll() {
        return ResponseEntity.ok(resourceService.getAll());
    }

    @GetMapping("/by-lesson/{leccion_id}")
    public ResponseEntity<List<ResourceDto>> getResourcesByLesson(@PathVariable Long leccion_id) {
        List<ResourceDto> resources = resourceService.findByLessonId(leccion_id);
        return ResponseEntity.ok(resources);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDto> update(@PathVariable Long id, @RequestBody ResourceDto dto) {
        return ResponseEntity.ok(resourceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
