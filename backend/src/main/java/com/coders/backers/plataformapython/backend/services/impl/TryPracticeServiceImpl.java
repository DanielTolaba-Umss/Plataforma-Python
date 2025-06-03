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
import java.util.stream.Collectors; 
@Service
@RequiredArgsConstructor
public class TryPracticeServiceImpl implements TryPracticeService {

    private final TryPracticeRepository tryPracticeRepository;
    private final PythonExecution pythonExecution;
    private final PracticeService practiceService;
    private final StudentService studentService;
    private final TestCaseService testCaseService;
    private final TryPracticeMapper tryPracticeMapper;

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

            Boolean[] testResults = new Boolean[testCases.size()];

            for (int i = 0; i < testCases.size(); i++) {
                TestCaseDto testCase = testCases.get(i);
                CodeExecutionResult result = pythonExecution.executeCode(codeReceived, testCase.getEntrada());
                    /* 
                     * {
                        "code": "def suma_lista(numeros):\n    suma = 0\n    for num in numeros:\n        suma += num\n    return suma",
                        "studentId": 1,
                        "practiceId": 1
                        }
                     */
                
                testResults[i] = result.isSuccess() && 
                            result.getOutput().trim().equals(testCase.getSalida().trim());
                feedback += "[Test case " + (i + 1) + ": " 
                                + (result.getError()) +  "\n"
                                + "Received: " + result.getOutput() + "\n]";
            }

            boolean allTestsPassed = true;
            for (Boolean resultt : testResults) {
                if (Boolean.FALSE.equals(resultt)) {
                    allTestsPassed = false;
                    break;
                }
            }

            // Mapear StudentEntity y PracticeEntity desde los DTOs
            

             TryPracticeEntity entity = new TryPracticeEntity();
                entity.setCode(codeReceived);
                entity.setStudent(student);
                entity.setPractice(practice);
                entity.setTestResults(testResults);
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
}
