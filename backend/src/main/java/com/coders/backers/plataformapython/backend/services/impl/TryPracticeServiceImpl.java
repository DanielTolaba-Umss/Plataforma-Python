package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.practice.PracticeDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.testcase.TestCaseDto;
import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionResult;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.PracticeMapper;
import com.coders.backers.plataformapython.backend.mapper.StudentMapper;
import com.coders.backers.plataformapython.backend.mapper.TryPracticeMapper;
import com.coders.backers.plataformapython.backend.models.PracticeEntity;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.TryPracticeRepository;
import com.coders.backers.plataformapython.backend.services.PracticeService;
import com.coders.backers.plataformapython.backend.services.StudentService;
import com.coders.backers.plataformapython.backend.services.TestCaseService;
import com.coders.backers.plataformapython.backend.services.TryPracticeService;
import com.coders.backers.plataformapython.backend.utils.PythonExecution;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors; 
@Service
@RequiredArgsConstructor
public class TryPracticeServiceImpl implements TryPracticeService {

    private final TryPracticeRepository tryPracticeRepository;
    private final PythonExecution pythonExecution;
    private final PracticeService practiceService;
    private final StudentService studentService;
    private final TestCaseService testCaseService;

    @Override
    public TryPracticeDto createTryPractice(CodeExecutionRequest code) {

        if (code == null) {
            throw new IllegalArgumentException("CodeExecutionRequest cannot be null");
        }

        String codeReceived = code.getCode();
        Long studentId = code.getStudentId();
        Long practiceId = code.getPracticeId();
        String feedback = "";

        try {
            StudentDto studentDto = studentService.getStudentById(studentId);
            StudentEntity student = StudentMapper.mapToEntity(studentDto);
            if (studentDto == null) {
                throw new ResourceNotFoundException("Student not found with id: " + studentId);
            }

            PracticeDto practiceDto = practiceService.getPracticeById(practiceId);
            PracticeEntity practice = PracticeMapper.mapToEntity(practiceDto);
            if (practiceDto == null) {
                throw new ResourceNotFoundException("Practice not found with id: " + practiceId);
            }

            boolean hasApprovedAttempt = getByStudentId(studentId).stream()
                    .filter(tryPractice -> tryPractice.getPractice().getId().equals(practiceId))
                    .anyMatch(tryPractice -> tryPractice.getApproved());

            if (hasApprovedAttempt) {
                throw new IllegalStateException("Ya existe un intento aprobado para esta práctica");
            }
            List<TestCaseDto> testCases = testCaseService.getByPractice(practiceId);
            if (testCases.isEmpty()) {
                throw new ResourceNotFoundException("No test cases found for practice with id: " + practiceId);
            }

            StringBuilder testResultsJson = new StringBuilder("[");
            boolean allTestsPassed = true;

            for (int i = 0; i < testCases.size(); i++) {
                TestCaseDto testCase = testCases.get(i);
                CodeExecutionResult result = pythonExecution.executeCode(
                        codeReceived,
                        testCase.getEntrada(),
                        testCase.getSalida());

                boolean success = result.isSuccess();
                if (!success) {
                    allTestsPassed = false;
                }

                testResultsJson.append(success);
                if (i < testCases.size() - 1) {
                    testResultsJson.append(",");
                }

                feedback += String.format(
                        "Test Case %d:\n" +
                                "  Entrada: %s\n" +
                                "  Esperado: %s\n" +
                                "  Recibido: %s\n" +
                                "  Estado: %s\n" +
                                "  %s\n\n",
                        i + 1,
                        testCase.getEntrada(),
                        testCase.getSalida(),
                        result.getOutput() != null ? result.getOutput().trim() : "Sin salida",
                        success ? "✓ PASÓ" : "✗ FALLÓ",
                        result.getError() != null && !result.getError().isEmpty() ? "Error: " + result.getError() : "");
            }

            testResultsJson.append("]");

            TryPracticeEntity entity = new TryPracticeEntity();
            entity.setCode(codeReceived);
            entity.setStudent(student);
            entity.setPractice(practice);
            entity.setTestResults(testResultsJson.toString());
            entity.setApproved(allTestsPassed);
            entity.setFeedback(feedback);
            entity.setCreateAt(LocalDateTime.now());

            TryPracticeEntity savedEntity = tryPracticeRepository.save(entity);

            return TryPracticeMapper.mapToDto(savedEntity);
        } catch (Exception e) {
            throw new RuntimeException("Error processing practice attempt: " + e.getMessage(), e);
        }
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
    public List<TryPracticeDto> getByStudentId(Long studentId) {
        return tryPracticeRepository.findByStudentId(studentId).stream()
                .map(TryPracticeMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TryPracticeDto> getByPracticeId(Long practiceId) {
        return tryPracticeRepository.findByPracticeId(practiceId).stream()
                .map(TryPracticeMapper::mapToDto)
                .collect(Collectors.toList());
    }


    public static Boolean[] parseTestResults(String testResultsJson) {
        if (testResultsJson == null || testResultsJson.trim().isEmpty()) {
            return new Boolean[0];
        }

        try {
            if (testResultsJson.trim().startsWith("[") && testResultsJson.trim().endsWith("]")) {
                String trimmed = testResultsJson.trim();

                if (!trimmed.contains("{") && (trimmed.contains("true") || trimmed.contains("false"))) {
                    String[] values = trimmed
                            .substring(1, trimmed.length() - 1)
                            .split(",");

                    Boolean[] results = new Boolean[values.length];
                    for (int i = 0; i < values.length; i++) {
                        results[i] = Boolean.valueOf(values[i].trim());
                    }
                    return results;
                } else if (trimmed.contains("{")) {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    List<Map<String, Object>> testDetails = mapper.readValue(
                            trimmed,
                            mapper.getTypeFactory().constructCollectionType(List.class, Map.class));

                    Boolean[] results = new Boolean[testDetails.size()];
                    for (int i = 0; i < testDetails.size(); i++) {
                        results[i] = (Boolean) testDetails.get(i).get("success");
                    }
                    return results;
                }
            }
            return new Boolean[0];
        } catch (Exception e) {
            return new Boolean[0];
        }
    }
}
