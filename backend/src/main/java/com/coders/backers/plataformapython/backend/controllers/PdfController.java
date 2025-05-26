package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.models.PdfEntity;
import com.coders.backers.plataformapython.backend.services.PdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pdfs")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/upload")
    public ResponseEntity<PdfEntity> uploadPdf(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam MultipartFile file) {
        return ResponseEntity.ok(pdfService.uploadPdf(name, description, file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PdfEntity> updatePdf(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description) {
        return ResponseEntity.ok(pdfService.updatePdf(id, name, description));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePdf(@PathVariable Long id) {
        pdfService.deletePdf(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PdfEntity>> getAllPdfs() {
        return ResponseEntity.ok(pdfService.getAllPdfs());
    }
}
