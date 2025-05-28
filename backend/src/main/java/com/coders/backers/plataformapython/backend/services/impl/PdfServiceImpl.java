package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.models.PdfEntity;
import com.coders.backers.plataformapython.backend.repository.PdfRepository;
import com.coders.backers.plataformapython.backend.services.PdfService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PdfServiceImpl implements PdfService {

    private final PdfRepository pdfRepository;

    @Value("${pdf.upload.directory}")
    private String uploadDirectory;

    public PdfServiceImpl(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    @Override
    public PdfEntity uploadPdf(String name, String description, MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDirectory, filename);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        PdfEntity pdf = new PdfEntity();
        pdf.setName(name);
        pdf.setDescription(description);
        pdf.setFilePath(filePath.toString());
        return pdfRepository.save(pdf);
    }

    @Override
    public PdfEntity updatePdf(Long id, String name, String description, MultipartFile file) throws IOException {
        PdfEntity existing = pdfRepository.findById(id).orElseThrow(() -> new RuntimeException("PDF no encontrado"));

        // Eliminar archivo anterior
        Files.deleteIfExists(Paths.get(existing.getFilePath()));

        // Subir nuevo archivo
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDirectory, filename);
        Files.write(filePath, file.getBytes());

        existing.setName(name);
        existing.setDescription(description);
        existing.setFilePath(filePath.toString());

        return pdfRepository.save(existing);
    }

    @Override
    public void deletePdf(Long id) throws IOException {
        PdfEntity pdf = pdfRepository.findById(id).orElseThrow(() -> new RuntimeException("PDF no encontrado"));
        Files.deleteIfExists(Paths.get(pdf.getFilePath()));
        pdfRepository.delete(pdf);
    }

    @Override
    public Optional<PdfEntity> getPdf(Long id) {
        return pdfRepository.findById(id);
    }

    @Override
    public List<PdfEntity> getAllPdfs() {
        return pdfRepository.findAll();
    }
}
