package com.coders.backers.plataformapython.backend.services;

import org.springframework.web.multipart.MultipartFile;
import com.coders.backers.plataformapython.backend.models.PdfEntity;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface PdfService {
    PdfEntity uploadPdf(String name, String description, MultipartFile file) throws IOException;
    PdfEntity updatePdf(Long id, String name, String description, MultipartFile file) throws IOException;
    void deletePdf(Long id) throws IOException;
    Optional<PdfEntity> getPdf(Long id);
    List<PdfEntity> getAllPdfs();
}
