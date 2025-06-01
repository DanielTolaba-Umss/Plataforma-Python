package com.coders.backers.plataformapython.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.UpdateTeacherDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.repository.TeacherRepository;
import com.coders.backers.plataformapython.backend.services.impl.TeacherServiceImpl;

class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherServiceImpl teacherService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTeacherTest() {
        CreateTeacherDto createDto = new CreateTeacherDto();
        createDto.setName("Juan");
        createDto.setLastName("García");
        createDto.setPhone("12345678");
        createDto.setPassword("Pass123@");
        createDto.setEmail("juan@test.com");
        createDto.setSpecialty("Python");

        TeacherEntity savedEntity = new TeacherEntity();
        savedEntity.setId(1L);
        savedEntity.setName(createDto.getName());
        savedEntity.setLastName(createDto.getLastName());

        when(teacherRepository.save(any(TeacherEntity.class))).thenReturn(savedEntity);

        TeacherDto result = teacherService.createTeacher(createDto);

        assertNotNull(result);
        assertEquals(createDto.getName(), result.getName());
        verify(teacherRepository).save(any(TeacherEntity.class));
    }

    @Test
    void listTeachersTest() {
        TeacherEntity teacher1 = new TeacherEntity();
        teacher1.setName("Juan");
        TeacherEntity teacher2 = new TeacherEntity();
        teacher2.setName("María");

        when(teacherRepository.findAll()).thenReturn(Arrays.asList(teacher1, teacher2));

        List<TeacherDto> result = teacherService.getAllTeachers();

        assertEquals(2, result.size());
        verify(teacherRepository).findAll();
    }

    @Test
    void getTeacherByIdTest() {

        Long teacherId = 1L;
        TeacherEntity teacher = new TeacherEntity();
        teacher.setId(teacherId);
        teacher.setName("Juan");

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));

        TeacherDto result = teacherService.getTeacherById(teacherId);

        assertNotNull(result);
        assertEquals(teacher.getName(), result.getName());
    }

    @Test
    void teacherNotFoundTest() {
        Long teacherId = 999L;
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            teacherService.getTeacherById(teacherId);
        });
    }

    @Test
    void updateTeacherTest() {
        Long teacherId = 1L;
        UpdateTeacherDto updateDto = new UpdateTeacherDto();
        updateDto.setName("Juan");
        updateDto.setLastName("García");
        updateDto.setPhone("12345678");
        updateDto.setPassword("Pass123@");

        TeacherEntity existingTeacher = new TeacherEntity();
        existingTeacher.setId(teacherId);

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(existingTeacher));
        when(teacherRepository.save(any(TeacherEntity.class))).thenReturn(existingTeacher);

        TeacherDto result = teacherService.updateTeacher(teacherId, updateDto);

        assertNotNull(result);
        verify(teacherRepository).save(any(TeacherEntity.class));
    }

    @Test
    void findTeacherBySpecialtyTest() {
        String specialty = "Python";
        TeacherEntity teacher = new TeacherEntity();
        teacher.setSpecialty(specialty);

        when(teacherRepository.findBySpecialty(specialty)).thenReturn(Arrays.asList(teacher));

        List<TeacherDto> result = teacherService.searchTeachersBySpecialty(specialty);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(teacherRepository).findBySpecialty(specialty);
    }

    @Test
    void deactivateTeacherTest() {
        Long teacherId = 1L;
        TeacherEntity teacher = new TeacherEntity();
        teacher.setId(teacherId);
        teacher.setActive(true);

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(teacherRepository.save(any(TeacherEntity.class))).thenReturn(teacher);

        TeacherDto result = teacherService.deactivateTeacher(teacherId);

        assertNotNull(result);
        assertFalse(result.isActive());
    }
}
