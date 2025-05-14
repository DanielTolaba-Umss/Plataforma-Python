package com.coders.backers.plataformapython.backend.mapper;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.models.ModuleEntity;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;

import java.util.Set;
import java.util.stream.Collectors;

import com.coders.backers.plataformapython.backend.enums.Role;


public class TeacherMapper {
    

    public static TeacherEntity mapFromCreateDto(CreateTeacherDto dto) {
        TeacherEntity entity = new TeacherEntity();
        entity.setName(dto.getName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setRole(Role.TEACHER.name());
        entity.setPassword(dto.getPassword());
        entity.setSpecialty(dto.getSpecialty());
        return entity;
    }

    public static TeacherDto mapToDto(TeacherEntity entity) {
        TeacherDto dto = new TeacherDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setSpecialty(entity.getSpecialty());
        dto.setRole(entity.getRole());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setActive(entity.isActive());      
        return dto;
    }
}