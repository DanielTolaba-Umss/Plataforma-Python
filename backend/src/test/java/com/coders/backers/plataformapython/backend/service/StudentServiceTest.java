package com.coders.backers.plataformapython.backend.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.services.impl.StudentServiceImpl;

public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createStudent_WithCourses_ShouldAssignCoursesCorrectly() {
        // Arrange
        CreateStudentDto createDto = new CreateStudentDto();
        createDto.setNombres("Juan");
        createDto.setApellidos("Pérez");
        createDto.setEmail("juan.perez@example.com");
        createDto.setCursos(Arrays.asList(1L, 2L));

        CourseEntity course1 = new CourseEntity();
        course1.setId(1L);
        course1.setTitle("Python Básico");

        CourseEntity course2 = new CourseEntity();
        course2.setId(2L);
        course2.setTitle("Python Intermedio");

        StudentEntity studentEntity = new StudentEntity();
        studentEntity.setId(1L);
        studentEntity.setName("Juan");
        studentEntity.setLastName("Pérez");
        studentEntity.setEmail("juan.perez@example.com");
        Set<CourseEntity> courses = new HashSet<>();
        courses.add(course1);
        courses.add(course2);
        studentEntity.setCourses(courses);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course1));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(course2));
        when(studentRepository.save(any(StudentEntity.class))).thenReturn(studentEntity);

        // Act
        StudentDto result = studentService.createStudent(createDto);

        // Assert
        assertNotNull(result);
        assertEquals("Juan", result.getNombres());
        assertEquals("Pérez", result.getApellidos());
        assertEquals("juan.perez@example.com", result.getEmail());
        assertNotNull(result.getCursos());
        assertEquals(2, result.getCursos().size());
        assertTrue(result.getCursos().contains(1L));
        assertTrue(result.getCursos().contains(2L));
        
        verify(courseRepository).findById(1L);
        verify(courseRepository).findById(2L);
        verify(studentRepository).save(any(StudentEntity.class));
    }

    @Test
    void createStudent_WithoutCourses_ShouldCreateStudentWithEmptyCourses() {
        // Arrange
        CreateStudentDto createDto = new CreateStudentDto();
        createDto.setNombres("María");
        createDto.setApellidos("García");
        createDto.setEmail("maria.garcia@example.com");

        StudentEntity studentEntity = new StudentEntity();
        studentEntity.setId(2L);
        studentEntity.setName("María");
        studentEntity.setLastName("García");
        studentEntity.setEmail("maria.garcia@example.com");
        studentEntity.setCourses(new HashSet<>());

        when(studentRepository.save(any(StudentEntity.class))).thenReturn(studentEntity);

        // Act
        StudentDto result = studentService.createStudent(createDto);

        // Assert
        assertNotNull(result);
        assertEquals("María", result.getNombres());
        assertEquals("García", result.getApellidos());
        assertEquals("maria.garcia@example.com", result.getEmail());
        assertNotNull(result.getCursos());
        assertEquals(0, result.getCursos().size());
        
        verify(studentRepository).save(any(StudentEntity.class));
        verifyNoInteractions(courseRepository);
    }

    @Test
    void updateStudent_WithNewCourses_ShouldUpdateCoursesCorrectly() {
        // Arrange
        Long studentId = 1L;
        UpdateStudentDto updateDto = new UpdateStudentDto();
        updateDto.setNombres("Juan Carlos");
        updateDto.setApellidos("Pérez");
        updateDto.setEmail("juan.carlos.perez@example.com");
        updateDto.setCursos(Arrays.asList(3L, 4L));

        StudentEntity existingStudent = new StudentEntity();
        existingStudent.setId(studentId);
        existingStudent.setName("Juan");
        existingStudent.setLastName("Pérez");
        existingStudent.setEmail("juan.perez@example.com");

        CourseEntity course3 = new CourseEntity();
        course3.setId(3L);
        course3.setTitle("Python Avanzado");

        CourseEntity course4 = new CourseEntity();
        course4.setId(4L);
        course4.setTitle("Django Framework");

        StudentEntity updatedStudent = new StudentEntity();
        updatedStudent.setId(studentId);
        updatedStudent.setName("Juan Carlos");
        updatedStudent.setLastName("Pérez");
        updatedStudent.setEmail("juan.carlos.perez@example.com");
        Set<CourseEntity> updatedCourses = new HashSet<>();
        updatedCourses.add(course3);
        updatedCourses.add(course4);
        updatedStudent.setCourses(updatedCourses);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(existingStudent));
        when(courseRepository.findById(3L)).thenReturn(Optional.of(course3));
        when(courseRepository.findById(4L)).thenReturn(Optional.of(course4));
        when(studentRepository.save(any(StudentEntity.class))).thenReturn(updatedStudent);

        // Act
        Optional<StudentDto> result = studentService.updateStudent(studentId, updateDto);

        // Assert
        assertTrue(result.isPresent());
        StudentDto studentDto = result.get();
        assertEquals("Juan Carlos", studentDto.getNombres());
        assertEquals("Pérez", studentDto.getApellidos());
        assertEquals("juan.carlos.perez@example.com", studentDto.getEmail());
        assertNotNull(studentDto.getCursos());
        assertEquals(2, studentDto.getCursos().size());
        assertTrue(studentDto.getCursos().contains(3L));
        assertTrue(studentDto.getCursos().contains(4L));
        
        verify(studentRepository).findById(studentId);
        verify(courseRepository).findById(3L);
        verify(courseRepository).findById(4L);
        verify(studentRepository).save(any(StudentEntity.class));
    }

    @Test
    void getStudentById_WhenExists_ShouldReturnStudentWithCourses() {
        // Arrange
        Long studentId = 1L;
        
        CourseEntity course1 = new CourseEntity();
        course1.setId(1L);
        course1.setTitle("Python Básico");

        StudentEntity studentEntity = new StudentEntity();
        studentEntity.setId(studentId);
        studentEntity.setName("Ana");
        studentEntity.setLastName("López");
        studentEntity.setEmail("ana.lopez@example.com");
        Set<CourseEntity> courses = new HashSet<>();
        courses.add(course1);
        studentEntity.setCourses(courses);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(studentEntity));

        // Act
        StudentDto result = studentService.getStudentById(studentId);

        // Assert

        assertEquals("Ana", result.getNombres());
        assertEquals("López",result.getApellidos());
        assertEquals("ana.lopez@example.com", result.getEmail());
        assertNotNull(result.getCursos());
        assertEquals(1, result.getCursos().size());
        assertTrue(result.getCursos().contains(1L));
        
        verify(studentRepository).findById(studentId);
    }

    @Test
    void getAllStudents_ShouldReturnListWithCourses() {
        // Arrange
        CourseEntity course1 = new CourseEntity();
        course1.setId(1L);
        course1.setTitle("Python Básico");

        StudentEntity student1 = new StudentEntity();
        student1.setId(1L);
        student1.setName("Carlos");
        student1.setLastName("Ruiz");
        student1.setEmail("carlos.ruiz@example.com");
        Set<CourseEntity> courses1 = new HashSet<>();
        courses1.add(course1);
        student1.setCourses(courses1);

        StudentEntity student2 = new StudentEntity();
        student2.setId(2L);
        student2.setName("Sofía");
        student2.setLastName("Morales");
        student2.setEmail("sofia.morales@example.com");
        student2.setCourses(new HashSet<>());

        when(studentRepository.findAll()).thenReturn(Arrays.asList(student1, student2));

        // Act
        List<StudentDto> results = studentService.getAllStudents();

        // Assert
        assertEquals(2, results.size());
        
        StudentDto firstStudent = results.get(0);
        assertEquals("Carlos", firstStudent.getNombres());
        assertEquals(1, firstStudent.getCursos().size());
        assertTrue(firstStudent.getCursos().contains(1L));
        
        StudentDto secondStudent = results.get(1);
        assertEquals("Sofía", secondStudent.getNombres());
        assertEquals(0, secondStudent.getCursos().size());
        
        verify(studentRepository).findAll();
    }
}
