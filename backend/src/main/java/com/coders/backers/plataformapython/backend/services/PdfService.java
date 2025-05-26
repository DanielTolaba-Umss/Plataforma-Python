package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.models.PdfEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PdfService {
    PdfEntity uploadPdf(String name, String description, MultipartFile file);
    PdfEntity updatePdf(Long id, String name, String description);
    void deletePdf(Long id);
    List<PdfEntity> getAllPdfs();
}
