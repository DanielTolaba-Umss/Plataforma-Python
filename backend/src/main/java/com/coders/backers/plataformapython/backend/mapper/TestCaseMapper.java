package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.testcase.*;
import com.coders.backers.plataformapython.backend.models.*;

public class TestCaseMapper {

    public static TestCaseEntity fromCreateDto(CreateTestCaseDto dto, PracticeEntity practice) {
        return new TestCaseEntity(null, practice, dto.getEntrada(), dto.getSalida(),dto.getEntradaTestCase());
    }

    public static TestCaseDto toDto(TestCaseEntity e) {
        return new TestCaseDto(e.getId(), e.getPractice().getId(), e.getEntrada(), e.getSalida(),e.getEntradaTestCase());
    }

    public static void updateEntity(UpdateTestCaseDto dto, TestCaseEntity e) {
        e.setEntrada(dto.getEntrada());
        e.setSalida(dto.getSalida());
    }
}
