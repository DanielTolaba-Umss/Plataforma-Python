package com.coders.backers.plataformapython.backend.controllers;

import com.coders.backers.plataformapython.backend.models.PdfEntity;
import com.coders.backers.plataformapython.backend.services.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pdfs")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    @PostMapping("/upload")
    public ResponseEntity<PdfEntity> uploadPdf(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(pdfService.uploadPdf(name, description, file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PdfEntity> updatePdf(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(pdfService.updatePdf(id, name, description, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePdf(@PathVariable Long id) throws IOException {
        pdfService.deletePdf(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PdfEntity> getPdf(@PathVariable Long id) {
        return pdfService.getPdf(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PdfEntity>> getAllPdfs() {
        return ResponseEntity.ok(pdfService.getAllPdfs());
    }
}
