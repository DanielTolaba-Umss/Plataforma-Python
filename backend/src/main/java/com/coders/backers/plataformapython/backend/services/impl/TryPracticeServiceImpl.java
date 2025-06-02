package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.practice.PracticeDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.TryPracticeMapper;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;
import com.coders.backers.plataformapython.backend.repository.TryPracticeRepository;
import com.coders.backers.plataformapython.backend.services.PracticeService;
import com.coders.backers.plataformapython.backend.services.StudentService;
import com.coders.backers.plataformapython.backend.services.TryPracticeService;
import com.coders.backers.plataformapython.backend.utils.PythonExecution;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TryPracticeServiceImpl implements TryPracticeService {

    private final TryPracticeRepository tryPracticeRepository;
    private final PythonExecution pythonExecution;
    private PracticeService practiceService;
    private StudentService studentService;

    @Override
    public TryPracticeDto createTryPractice(CodeExecutionRequest code) {
        TryPracticeEntity entity = TryPracticeMapper.mapToEntity(code);

        try {
            StudentDto student = studentService.getStudentById(code.getStudentId());
            if (student == null) {
                throw new ResourceNotFoundException("Student not found with id: " + code.getStudentId());
            }

            PracticeDto practice = practiceService.getPracticeById(code.getPracticeId());
            if (practice == null) {
                throw new ResourceNotFoundException("Practice not found with id: " + code.getPracticeId());
            }

            String testCases = practice.getCasosPrueba();
            
            String codeReceived = entity.getCode();
        } catch (Exception e) {
        }

        return TryPracticeMapper.mapToDto(tryPracticeRepository.save(entity));
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
    public List<TryPracticeDto> getByEstudianteId(Long estudianteId) {
        return tryPracticeRepository.findByEstudianteProgresoId(estudianteId).stream()
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
