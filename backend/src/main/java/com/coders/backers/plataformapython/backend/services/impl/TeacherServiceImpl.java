package com.coders.backers.plataformapython.backend.services.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;


import com.coders.backers.plataformapython.backend.services.TeacherService;
import com.coders.backers.plataformapython.backend.dto.module.ModuleDto;
import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.enums.Role;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.ModuleMapper;
import com.coders.backers.plataformapython.backend.mapper.TeacherMapper;
import com.coders.backers.plataformapython.backend.models.ModuleEntity;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.repository.ModuleRepository;
import com.coders.backers.plataformapython.backend.repository.TeacherRepository;


@Service
@AllArgsConstructor
@Slf4j
public class TeacherServiceImpl implements TeacherService {
    
    private final TeacherRepository teacherRepository;
    private final ModuleRepository moduleRepository;

    @Override
    public TeacherDto createTeacher(CreateTeacherDto createTeacherDto) {
        
        Set<ModuleEntity> modules = new HashSet<>();
        if (createTeacherDto.getModuleIds() != null && !createTeacherDto.getModuleIds().isEmpty()) {
            modules = new HashSet<>(moduleRepository.findAllById(createTeacherDto.getModuleIds()));
            log.info("Found {} modules for teacher", modules.size());
        }

        TeacherEntity entity = TeacherMapper.mapFromCreateDto(createTeacherDto, modules);
        
        TeacherEntity savedEntity = teacherRepository.save(entity);

        return TeacherMapper.mapToDto(savedEntity);
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        List<TeacherEntity> teachers = teacherRepository.findAll();
        return teachers.stream().map(teacher -> {
            TeacherDto teacherDto = TeacherMapper.mapToDto(teacher);
            Set<ModuleDto> moduleDtos = teacher.getModules().stream()
                .map(module -> ModuleMapper.mapToModelDto(module))
                .collect(Collectors.toSet());
                teacherDto.setModules(moduleDtos);
                return teacherDto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteTeacher(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(false); 
        teacherRepository.save(teacher);
    }

    @Override
    public List<TeacherDto> getAllActiveTeachers() {
        List<TeacherEntity> teachers = teacherRepository.findByActive(false);
        return teachers.stream().map(teacher -> {
            TeacherDto teacherDto = TeacherMapper.mapToDto(teacher);
            Set<ModuleDto> moduleDtos = teacher.getModules().stream()
                .map(module -> ModuleMapper.mapToModelDto(module))
                .collect(Collectors.toSet());
                teacherDto.setModules(moduleDtos);
                return teacherDto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<TeacherDto> searchTeachersBySpecialty(String specialty) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'searchTeachersBySpecialty'");
    }
}
