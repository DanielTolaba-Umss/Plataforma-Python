package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.CreateTryPracticeDto;
import com.coders.backers.plataformapython.backend.dto.tryPractice.UpdateTryPracticeDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.TryPracticeMapper;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;
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

    @Override
    public TryPracticeDto createTryPractice(CreateTryPracticeDto dto) {
        TryPracticeEntity entity = TryPracticeMapper.mapFromCreateDto(dto);
        return TryPracticeMapper.mapToDto(tryPracticeRepository.save(entity));
    }

    @Override
    public TryPracticeDto updateTryPractice(Long id, UpdateTryPracticeDto dto) {
        TryPracticeEntity entity = tryPracticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TryPractice not found with id: " + id));

        TryPracticeMapper.mapFromUpdateDto(dto, entity);

        return TryPracticeMapper.mapToDto(tryPracticeRepository.save(entity));
    }

    @Override
    public void deleteTryPractice(Long id) {
        TryPracticeEntity entity = tryPracticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TryPractice not found with id: " + id));
        tryPracticeRepository.delete(entity);
    }

    @Override
    public TryPracticeDto getTryPracticeById(Long id) {
        return tryPracticeRepository.findById(id)
                .map(TryPracticeMapper::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("TryPractice not found with id: " + id));
    }

    @Override
    public List<TryPracticeDto> getAllTryPractices() {
        return tryPracticeRepository.findAll().stream()
                .map(TryPracticeMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TryPracticeDto> getByEstudianteProgresoId(Long estudianteProgresoId) {
        return tryPracticeRepository.findByEstudianteProgresoId(estudianteProgresoId).stream()
                .map(TryPracticeMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TryPracticeDto> getByPracticeId(Long practiceId) {
        return tryPracticeRepository.findByPracticeId(practiceId).stream()
                .map(TryPracticeMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
