package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.models.PdfEntity;
import com.coders.backers.plataformapython.backend.repository.PdfRepository;
import com.coders.backers.plataformapython.backend.services.PdfService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PdfServiceImpl implements PdfService {

    private final PdfRepository pdfRepository;

    @Value("${pdf.upload.directory}")
    private String uploadDir;

    public PdfServiceImpl(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    @Override
    public PdfEntity uploadPdf(String name, String description, MultipartFile file) {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir + "/" + filename);

        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }

        PdfEntity pdf = new PdfEntity();
        pdf.setName(name);
        pdf.setDescription(description);
        pdf.setFilePath(dest.getAbsolutePath());

        return pdfRepository.save(pdf);
    }

    @Override
    public PdfEntity updatePdf(Long id, String name, String description) {
        Optional<PdfEntity> optionalPdf = pdfRepository.findById(id);
        if (optionalPdf.isPresent()) {
            PdfEntity pdf = optionalPdf.get();
            pdf.setName(name);
            pdf.setDescription(description);
            return pdfRepository.save(pdf);
        }
        throw new RuntimeException("PDF no encontrado");
    }

    @Override
    public void deletePdf(Long id) {
        Optional<PdfEntity> optionalPdf = pdfRepository.findById(id);
        optionalPdf.ifPresent(pdf -> {
            File file = new File(pdf.getFilePath());
            if (file.exists()) {
                file.delete();
            }
            pdfRepository.deleteById(id);
        });
    }

    @Override
    public List<PdfEntity> getAllPdfs() {
        return pdfRepository.findAll();
    }
}
