package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;

import java.util.List;

public interface TryPracticeService {
    TryPracticeDto createTryPractice(CodeExecutionRequest code);

    TryPracticeDto getTryPracticeById(Long id);
    List<TryPracticeDto> getAllTryPractices();
    List<TryPracticeDto> getByEstudianteId(Long estudianteId);
    List<TryPracticeDto> getByPracticeId(Long practiceId);
}
