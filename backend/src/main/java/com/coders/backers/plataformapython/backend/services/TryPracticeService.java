package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;

import java.util.List;

public interface TryPracticeService {
    TryPracticeDto createTryPractice(CreateTryPracticeDto dto);
    TryPracticeDto updateTryPractice(Long id, UpdateTryPracticeDto dto);
    void deleteTryPractice(Long id);
    TryPracticeDto getTryPracticeById(Long id);
    List<TryPracticeDto> getAllTryPractices();
    List<TryPracticeDto> getByEstudianteProgresoId(Long estudianteProgresoId);
    List<TryPracticeDto> getByPracticeId(Long practiceId);
}
