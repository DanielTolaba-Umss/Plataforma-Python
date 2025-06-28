package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.testcase.*;
import java.util.List;

public interface TestCaseService {
    TestCaseDto create(CreateTestCaseDto dto);
    TestCaseDto update(Long id, UpdateTestCaseDto dto);
    void delete(Long id);
    TestCaseDto getById(Long id);
    List<TestCaseDto> getByPractice(Long practiceId);
}