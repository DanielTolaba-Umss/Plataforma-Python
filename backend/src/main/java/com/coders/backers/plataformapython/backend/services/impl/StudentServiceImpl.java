package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.ModuloCompletadoDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProfileDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;
import com.coders.backers.plataformapython.backend.mapper.StudentMapper;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.services.StudentService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public StudentDto createStudent(CreateStudentDto dto) {
        StudentEntity entity = StudentMapper.mapFromCreateDto(dto);

        // Asignar cursos si los hay
        if (dto.getCursos() != null && !dto.getCursos().isEmpty()) {
            Set<CourseEntity> courses = assignCoursesToStudent(dto.getCursos());
            entity.setCourses(courses);
        }

        StudentEntity saved = studentRepository.save(entity);
        return StudentMapper.mapToDto(saved);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto getStudentById(Long id) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return StudentMapper.mapToDto(student);
    }    
    
    @Override
    public Optional<StudentDto> updateStudent(Long id, UpdateStudentDto dto) {
        return studentRepository.findById(id).map(existing -> {
            StudentEntity updatedEntity = StudentMapper.mapFromUpdateDto(dto, existing);
            updatedEntity.setId(id); // Mantener el ID original

            // Actualizar cursos si los hay
            if (dto.getCursos() != null) {
                Set<CourseEntity> courses = assignCoursesToStudent(dto.getCursos());
                updatedEntity.setCourses(courses);
            }

            StudentEntity saved = studentRepository.save(updatedEntity);
            return StudentMapper.mapToDto(saved);
        });
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    /**
     * Método helper para asignar cursos a un estudiante
     */
    private Set<CourseEntity> assignCoursesToStudent(List<Long> courseIds) {
        Set<CourseEntity> courses = new HashSet<>();
        if (courseIds != null && !courseIds.isEmpty()) {
            for (Long courseId : courseIds) {
                courseRepository.findById(courseId).ifPresent(courses::add);
            }
        }
        return courses;
    }

    @Override
    public Map<String, Object> uploadStudentsFromCsv(MultipartFile file) {
        List<StudentDto> savedStudents = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (lineNumber == 1) continue; // Skip header

                String[] fields = line.split(",");
                if (fields.length < 7) {
                    errors.add("Línea " + lineNumber + ": Formato inválido.");
                    continue;
                }

                try {
                    CreateStudentDto dto = new CreateStudentDto();
                    dto.setNombres(fields[0].trim());
                    dto.setApellidos(fields[1].trim());
                    dto.setEmail(fields[2].trim());
                    dto.setTelefono(fields[3].trim());
                    dto.setPassword(fields[6].trim());

                    StudentDto saved = createStudent(dto);
                    savedStudents.add(saved);
                } catch (Exception e) {
                    errors.add("Línea " + lineNumber + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo CSV: " + e.getMessage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("inserted", savedStudents.size());
        result.put("errors", errors);
        result.put("students", savedStudents);
        return result;
    }

    @Override
public StudentProfileDto getPerfilEstudiante(Long studentId) {
    StudentEntity student = studentRepository.findById(studentId)
        .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

    // Simulación de datos
    int modulosCompletados = 4;
    int ejerciciosCompletados = 12;
    String moduloActual = "Estructuras de Control";
    int progresoModuloActual = 80;
    int progresoGeneral = 75;

    List<ModuloCompletadoDto> modulos = List.of(
        new ModuloCompletadoDto("Introducción a Python", 95, LocalDate.of(2024, 12, 15)),
        new ModuloCompletadoDto("Variables y Tipos de Datos", 88, LocalDate.of(2024, 12, 22)),
        new ModuloCompletadoDto("Operadores y Expresiones", 92, LocalDate.of(2024, 12, 29)),
        new ModuloCompletadoDto("Funciones Básicas", 90, LocalDate.of(2025, 1, 5))
    );

    StudentProfileDto perfil = new StudentProfileDto();
    perfil.setId(student.getId());
    perfil.setNombreCompleto(student.getName() + " " + student.getLastName());
    perfil.setEmail(student.getEmail());
    perfil.setTelefono(student.getPhone());
    perfil.setFechaInicio(student.getEnrollmentDate().toLocalDate());
    perfil.setNivelActual(student.getCurrentLevel());
    perfil.setModulosCompletados(modulosCompletados);
    perfil.setEjerciciosCompletados(ejerciciosCompletados);
    perfil.setModuloActual(moduloActual);
    perfil.setProgresoModuloActual(progresoModuloActual);
    perfil.setProgresoGeneral(progresoGeneral);
    perfil.setModulosCompletadosDetalles(modulos);

    return perfil;
}
}
