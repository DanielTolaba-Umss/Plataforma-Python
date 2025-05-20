package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.TryPracticeMapper;
import com.coders.backers.plataformapython.backend.models.PracticeEntity;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;
import com.coders.backers.plataformapython.backend.repository.PracticeRepository;
import com.coders.backers.plataformapython.backend.repository.TryPracticeRepository;
import com.coders.backers.plataformapython.backend.services.TryPracticeService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TryPracticeServiceImpl implements TryPracticeService {

    private final TryPracticeRepository tryPracticeRepository;
    private final PracticeRepository practiceRepository;

    @Override
    public TryPracticeDto createTryPractice(CreateTryPracticeDto dto) {
        PracticeEntity practice = practiceRepository.findById(dto.getPracticeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Práctica no encontrada con ID: " + dto.getPracticeId()));

        TryPracticeEntity entity = TryPracticeMapper.fromCreateDto(dto, practice);
        return TryPracticeMapper.toDto(tryPracticeRepository.save(entity));
    }

    @Override
    public TryPracticeDto updateTryPractice(Long id, UpdateTryPracticeDto dto) {
        TryPracticeEntity entity = tryPracticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Intento no encontrado con ID: " + id));

        PracticeEntity practice = entity.getPractice(); // o buscar otro si quieres permitir cambiar

        TryPracticeMapper.updateEntity(dto, entity, practice);

        return TryPracticeMapper.toDto(tryPracticeRepository.save(entity));
    }

    @Override
    public void deleteTryPractice(Long id) {
        TryPracticeEntity entity = tryPracticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Intento no encontrado con ID: " + id));
        tryPracticeRepository.delete(entity);
    }

    @Override
    public TryPracticeDto getTryPracticeById(Long id) {
        return tryPracticeRepository.findById(id)
                .map(TryPracticeMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Intento no encontrado con ID: " + id));
    }

    @Override
    public List<TryPracticeDto> getAllTryPractices() {
        return tryPracticeRepository.findAll().stream()
                .map(TryPracticeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TryPracticeDto> getByPracticeId(Long practiceId) {
        return tryPracticeRepository.findByPractice_Id(practiceId).stream()
                .map(TryPracticeMapper::toDto)
                .collect(Collectors.toList());
    }
}
