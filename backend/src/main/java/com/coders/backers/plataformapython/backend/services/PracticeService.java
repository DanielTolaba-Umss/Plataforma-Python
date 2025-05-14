package com.coders.backers.plataformapython.backend.services;

import java.util.List;
import com.coders.backers.plataformapython.backend.dto.practice.*;

public interface PracticeService {
    PracticeModuleDto createPracticeModule(CreatePracticeModuleDto dto);
    List<PracticeModuleDto> getAllPracticeModules();
    void deletePracticeModule(Long id);
}
