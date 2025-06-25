package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.dto.resources.ResourceDto;
import com.coders.backers.plataformapython.backend.models.ResourceModel;
import com.coders.backers.plataformapython.backend.services.ResourceService;
import com.coders.backers.plataformapython.backend.services.impl.FileStorageService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
    }    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ResourceDto> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("contentId") Long contentId,
            @RequestParam("typeId") Long typeId) {

        try {
            String originalFilename = file.getOriginalFilename();

            String sanitizedFilename = originalFilename != null
                    ? originalFilename.replaceAll("\\s+", "_")
                    : "archivo.mp4";


            String uniqueFilename = UUID.randomUUID() + "_" + sanitizedFilename;

            String uploadDir = "uploads/videos";
            Path filePath = Paths.get(uploadDir, uniqueFilename);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String encodedFilename = URLEncoder.encode(uniqueFilename, StandardCharsets.UTF_8);
            String url = "/uploads/videos/" + encodedFilename;

            ResourceDto dto = new ResourceDto();
            dto.setTitle(title);
            dto.setContentId(contentId);
            dto.setTypeId(typeId);
            dto.setUrl(url);

            ResourceDto saved = resourceService.create(dto);

            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ResourceDto> create(@RequestBody ResourceDto dto) {
        return ResponseEntity.ok(resourceService.create(dto));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ResourceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getById(id));
    }    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<ResourceDto>> getAll() {
        return ResponseEntity.ok(resourceService.getAll());
    }
    
    @GetMapping("/by-lesson/{leccion_id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ResourceDto>> getResourcesByLesson(@PathVariable Long leccion_id) {
        List<ResourceDto> resources = resourceService.findByLessonId(leccion_id);
        return ResponseEntity.ok(resources);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ResourceDto> update(@PathVariable Long id, @RequestBody ResourceDto dto) {
        return ResponseEntity.ok(resourceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }    @PostMapping("/upload-pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ResourceDto> uploadPdf(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam("contentId") Long contentId,
        @RequestParam("typeId") Long typeId) {

    try {
        String originalFilename = file.getOriginalFilename();

        String sanitizedFilename = originalFilename != null
                ? originalFilename.replaceAll("\\s+", "_")
                : "documento.pdf";

        String uniqueFilename = UUID.randomUUID() + "_" + sanitizedFilename;

        String uploadDir = "uploads/pdfs";
        Path filePath = Paths.get(uploadDir, uniqueFilename);
        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String encodedFilename = URLEncoder.encode(uniqueFilename, StandardCharsets.UTF_8);
        String url = "/uploads/pdfs/" + encodedFilename;

        ResourceDto dto = new ResourceDto();
        dto.setTitle(title);
        dto.setContentId(contentId);
        dto.setTypeId(typeId);
        dto.setUrl(url);

        ResourceDto saved = resourceService.create(dto);

        return ResponseEntity.ok(saved);

    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    @PutMapping("/upload-pdf/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ResourceDto> updatePdf(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam("contentId") Long contentId,
        @RequestParam("typeId") Long typeId) {

    try {
        ResourceDto existing = resourceService.getById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        String oldPath = existing.getUrl().replace("/uploads/pdfs/", "uploads/pdfs/");
        Path oldFilePath = Paths.get(oldPath);
        Files.deleteIfExists(oldFilePath);

        String originalFilename = file.getOriginalFilename();
        String sanitizedFilename = originalFilename != null ? originalFilename.replaceAll("\\s+", "_") : "documento.pdf";
        String uniqueFilename = UUID.randomUUID() + "_" + sanitizedFilename;

        String uploadDir = "uploads/pdfs";
        Path newFilePath = Paths.get(uploadDir, uniqueFilename);
        Files.createDirectories(newFilePath.getParent());
        Files.copy(file.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);

        String encodedFilename = URLEncoder.encode(uniqueFilename, StandardCharsets.UTF_8);
        String url = "/uploads/pdfs/" + encodedFilename;

        existing.setTitle(title);
        existing.setContentId(contentId);
        existing.setTypeId(typeId);
        existing.setUrl(url);

        ResourceDto updated = resourceService.update(id, existing);
        return ResponseEntity.ok(updated);

    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    @DeleteMapping("/delete-pdf/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> deletePdf(@PathVariable Long id) {
    try {
        ResourceDto resource = resourceService.getById(id);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }
        String filePathStr = resource.getUrl().replace("/uploads/pdfs/", "uploads/pdfs/");
        Path filePath = Paths.get(filePathStr);
        Files.deleteIfExists(filePath);
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}    @GetMapping("/pdf/{filename}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Resource> servePdf(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/pdfs").resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
