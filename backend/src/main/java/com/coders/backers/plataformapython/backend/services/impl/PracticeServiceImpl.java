package com.coders.backers.plataformapython.backend.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.coders.backers.plataformapython.backend.dto.practice.*;
import com.coders.backers.plataformapython.backend.mapper.PracticeMapper;
import com.coders.backers.plataformapython.backend.models.*;
import com.coders.backers.plataformapython.backend.repository.*;
import com.coders.backers.plataformapython.backend.services.PracticeService;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final PracticeRepository practiceModuleRepository;
    private final LessonRepository lessonRepository;

    @Override
    public PracticeModuleDto createPracticeModule(CreatePracticeModuleDto dto) {
        LessonModel lesson = lessonRepository.findById(dto.getLeccionId())
            .orElseThrow(() -> new RuntimeException("Lesson not found"));
        PracticeModule module = PracticeMapper.fromCreateDto(dto, lesson);
        PracticeModule savedModule = practiceModuleRepository.save(module);
        return PracticeMapper.toDto(savedModule);
    }

    @Override
    public List<PracticeModuleDto> getAllPracticeModules() {
        return practiceModuleRepository.findAll().stream()
            .map(PracticeMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public void deletePracticeModule(Long id) {
        practiceModuleRepository.deleteById(id);
    }
}
