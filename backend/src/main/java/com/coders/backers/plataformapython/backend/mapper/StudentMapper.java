package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.enums.Role;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;

public class StudentMapper {

    public static StudentEntity mapFromCreateDto(CreateStudentDto dto) {
        StudentEntity entity = new StudentEntity();
        entity.setName(dto.getNombres());
        entity.setLastName(dto.getApellidos());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getTelefono());
        entity.setPassword(dto.getPassword());
        entity.setRole(Role.STUDENT.name());
        entity.setEnrollmentDate(Date.valueOf(LocalDate.now()));
        return entity;
    }

    public static StudentDto mapToDto(StudentEntity entity) {
        StudentDto dto = new StudentDto();
        dto.setId(entity.getId());
        dto.setNombres(entity.getName());
        dto.setApellidos(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setTelefono(entity.getPhone());
        dto.setActivo(entity.isActive());
        dto.setFechaInicio(entity.getEnrollmentDate().toLocalDate());

        dto.setCursos(Collections.emptyList());

        return dto;
    }

    public static StudentEntity mapFromUpdateDto(UpdateStudentDto dto) {
        StudentEntity entity = new StudentEntity();
        entity.setName(dto.getNombres());
        entity.setLastName(dto.getApellidos());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getTelefono());
        entity.setPassword(dto.getPassword());
        entity.setActive(dto.isActivo());
        entity.setRole(Role.STUDENT.name());
        return entity;
    }
}
