package com.coders.backers.plataformapython.backend.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.UpdateTeacherDto;
import com.coders.backers.plataformapython.backend.services.TeacherService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(TeacherController.class)
class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @Autowired
    private ObjectMapper objectMapper;

    private TeacherDto teacherDto;
    private CreateTeacherDto createTeacherDto;
    private UpdateTeacherDto updateTeacherDto;

    @BeforeEach
    void setUp() {
        teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setName("Juan");
        teacherDto.setLastName("García");
        teacherDto.setEmail("juan@test.com");
        teacherDto.setPhone("12345678");
        teacherDto.setSpecialty("Python");
        teacherDto.setActive(true);

        createTeacherDto = new CreateTeacherDto();
        createTeacherDto.setName("Juan");
        createTeacherDto.setLastName("García");
        createTeacherDto.setEmail("juan@test.com");
        createTeacherDto.setPhone("12345678");
        createTeacherDto.setPassword("Pass123@");
        createTeacherDto.setSpecialty("Python");

        updateTeacherDto = new UpdateTeacherDto();
        updateTeacherDto.setName("Juan");
        updateTeacherDto.setLastName("García");
        updateTeacherDto.setPhone("12345678");
        updateTeacherDto.setPassword("Pass123@");
        updateTeacherDto.setSpecialty("Python");
    }

    @Test
    void createTeacherTest() throws Exception {
        when(teacherService.createTeacher(any(CreateTeacherDto.class))).thenReturn(teacherDto);

        mockMvc.perform(post("/api/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createTeacherDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(teacherDto.getName()));
    }

    @Test
    void listTeachersTest() throws Exception {
        List<TeacherDto> teachers = Arrays.asList(teacherDto);
        when(teacherService.getAllTeachers()).thenReturn(teachers);

        mockMvc.perform(get("/api/teachers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(teacherDto.getName()));
    }

    @Test
    void getTeacherByIdTest() throws Exception {
        when(teacherService.getTeacherById(1L)).thenReturn(teacherDto);

        mockMvc.perform(get("/api/teachers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(teacherDto.getName()));
    }

    @Test
    void updateTeacherTest() throws Exception {
        when(teacherService.updateTeacher(eq(1L), any(UpdateTeacherDto.class))).thenReturn(teacherDto);

        mockMvc.perform(put("/api/teachers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateTeacherDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(teacherDto.getName()));
    }

    @Test
    void deactivateTeacherTest() throws Exception {
        teacherDto.setActive(false);
        when(teacherService.deactivateTeacher(1L)).thenReturn(teacherDto);

        mockMvc.perform(put("/api/teachers/1/deactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    void activateTeacherTest() throws Exception {
        when(teacherService.activateTeacher(1L)).thenReturn(teacherDto);

        mockMvc.perform(put("/api/teachers/1/activate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    void searchBySpecialtyTest() throws Exception {
        List<TeacherDto> teachers = Arrays.asList(teacherDto);
        when(teacherService.searchTeachersBySpecialty("Python")).thenReturn(teachers);

        mockMvc.perform(get("/api/teachers/search")
                .param("specialty", "Python"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].specialty").value("Python"));
    }

    @Test
    void searchByNameTest() throws Exception {
        List<TeacherDto> teachers = Arrays.asList(teacherDto);
        when(teacherService.searchTeachersByName("Juan")).thenReturn(teachers);

        mockMvc.perform(get("/api/teachers/search")
                .param("name", "Juan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Juan"));
    }

    @Test
    void searchByEmailTest() throws Exception {
        List<TeacherDto> teachers = Arrays.asList(teacherDto);
        when(teacherService.searchTeachersByEmail("juan@test.com")).thenReturn(teachers);

        mockMvc.perform(get("/api/teachers/search")
                .param("email", "juan@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("juan@test.com"));
    }
}
