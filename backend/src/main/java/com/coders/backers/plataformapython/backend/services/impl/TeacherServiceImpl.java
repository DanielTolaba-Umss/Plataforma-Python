package com.coders.backers.plataformapython.backend.services.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;


import com.coders.backers.plataformapython.backend.services.TeacherService;
import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.UpdateTeacherDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.TeacherMapper;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.repository.TeacherRepository;


@Service
@AllArgsConstructor
@Slf4j
public class TeacherServiceImpl implements TeacherService {
    
    private final TeacherRepository teacherRepository;

    @Override
    public TeacherDto createTeacher(CreateTeacherDto createTeacherDto) {

        TeacherEntity entity = TeacherMapper.mapFromCreateDto(createTeacherDto);
        
        TeacherEntity savedEntity = teacherRepository.save(entity);

        return TeacherMapper.mapToDto(savedEntity);
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        List<TeacherEntity> teachers = teacherRepository.findAll();
        return teachers.stream().map(teacher -> {
            TeacherDto teacherDto = TeacherMapper.mapToDto(teacher);
                return teacherDto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteTeacher(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        
        teacherRepository.delete(teacher);
    }

    @Override
    public List<TeacherDto> getAllActiveTeachers() {
        List<TeacherEntity> teachers = teacherRepository.findByActive(true);
        return teachers.stream().map(teacher -> {
            TeacherDto teacherDto = TeacherMapper.mapToDto(teacher);
                return teacherDto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<TeacherDto> searchTeachersBySpecialty(String specialty) {
        List<TeacherEntity> teachers = teacherRepository.findBySpecialty(specialty);
        return teachers.stream().map(teacher -> {
            TeacherDto teacherDto = TeacherMapper.mapToDto(teacher);
                return teacherDto;
        }).collect(Collectors.toList());
    }

    @Override
    public TeacherDto updateTeacher(Long id, UpdateTeacherDto updateTeacherDto) {
        TeacherEntity teacher = teacherRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        TeacherEntity updatedTeacher = TeacherMapper.mapFromUpdateDto(updateTeacherDto);
        updatedTeacher.setId(teacher.getId());
        updatedTeacher.setCreatedAt(teacher.getCreatedAt());
        updatedTeacher.setUpdatedAt(Date.valueOf(LocalDate.now()));

        TeacherEntity savedEntity = teacherRepository.save(updatedTeacher);

        return TeacherMapper.mapToDto(savedEntity);
    }

    @Override
    public TeacherDto deactivateTeacher(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(false); 
        teacher.setUpdatedAt(Date.valueOf(LocalDate.now()));
        teacherRepository.save(teacher);
        return TeacherMapper.mapToDto(teacher);
    }

    @Override
    public TeacherDto activateTeacher(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(true); 
        teacher.setUpdatedAt(Date.valueOf(LocalDate.now()));
        teacherRepository.save(teacher);
        return TeacherMapper.mapToDto(teacher);
    }

    @Override
    public List<TeacherDto> getAllInactiveTeachers() {
        List<TeacherEntity> teachers = teacherRepository.findByActive(false);
        return teachers.stream().map(teacher -> {
            TeacherDto teacherDto = TeacherMapper.mapToDto(teacher);
                return teacherDto;
        }).collect(Collectors.toList());
    }

    @Override
    public TeacherDto getTeacherById(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return TeacherMapper.mapToDto(teacher);
    }
}
