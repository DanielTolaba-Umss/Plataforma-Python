package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.testcase.*;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.TestCaseMapper;
import com.coders.backers.plataformapython.backend.models.*;
import com.coders.backers.plataformapython.backend.repository.*;
import com.coders.backers.plataformapython.backend.services.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {

    private final TestCaseRepository testCaseRepo;
    private final PracticeRepository practiceRepo;

    private static final int MAX_TEST_CASES_PER_PRACTICE = 2;

    @Override
    public TestCaseDto create(CreateTestCaseDto dto) {
        PracticeEntity practice = practiceRepo.findById(dto.getPracticeId())
                .orElseThrow(() -> new ResourceNotFoundException("Practice not found: " + dto.getPracticeId()));

        long count = testCaseRepo.countByPractice_Id(practice.getId());
        if (count >= MAX_TEST_CASES_PER_PRACTICE) {
            throw new IllegalStateException("Practice already has the maximum of 2 test cases");
        }

        TestCaseEntity entity = TestCaseMapper.fromCreateDto(dto, practice);
        return TestCaseMapper.toDto(testCaseRepo.save(entity));
    }

    @Override
    public TestCaseDto update(Long id, UpdateTestCaseDto dto) {
        TestCaseEntity entity = testCaseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found: " + id));
        TestCaseMapper.updateEntity(dto, entity);
        return TestCaseMapper.toDto(testCaseRepo.save(entity));
    }

    @Override
    public void delete(Long id) {
        TestCaseEntity entity = testCaseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found: " + id));
        testCaseRepo.delete(entity);
    }

    @Override
    public TestCaseDto getById(Long id) {
        return testCaseRepo.findById(id)
                .map(TestCaseMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found: " + id));
    }

    @Override
    public List<TestCaseDto> getByPractice(Long practiceId) {
        return testCaseRepo.findByPractice_Id(practiceId).stream()
                .map(TestCaseMapper::toDto)
                .collect(Collectors.toList());
    }
}
