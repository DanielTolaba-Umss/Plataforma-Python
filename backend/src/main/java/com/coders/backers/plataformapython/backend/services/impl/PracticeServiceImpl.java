package com.coders.backers.plataformapython.backend.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.coders.backers.plataformapython.backend.dto.practice.PracticeDto;
import com.coders.backers.plataformapython.backend.dto.practice.UpdatePracticeDto;
import com.coders.backers.plataformapython.backend.dto.practice.CreatePracticeDto;
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
    public PracticeDto createPractice(CreatePracticeDto dto) {
        LessonEntity lesson = lessonRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        PracticeEntity module = PracticeMapper.fromCreateDto(dto, lesson);
        PracticeEntity savedModule = practiceModuleRepository.save(module);
        return PracticeMapper.toDto(savedModule);
    }

    @Override
    public List<PracticeDto> getAllPractice() {
        return practiceModuleRepository.findAll().stream()
                .map(PracticeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deletePractice(Long id) {
        PracticeEntity entity = practiceModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice not found"));

        practiceModuleRepository.delete(entity);
    }

    @Override
    public PracticeDto updatePractice(Long id, UpdatePracticeDto dto) {
        PracticeEntity entity = practiceModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice module not found"));

        LessonEntity lesson = lessonRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        PracticeMapper.updateEntityFromDto(dto, entity, lesson);

        PracticeEntity updated = practiceModuleRepository.save(entity);
        return PracticeMapper.toDto(updated);
    }

}
