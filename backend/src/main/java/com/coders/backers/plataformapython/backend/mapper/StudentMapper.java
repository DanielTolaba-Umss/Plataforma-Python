package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentDto;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class StudentMapper {

    private static PasswordEncoder passwordEncoder;

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        StudentMapper.passwordEncoder = passwordEncoder;
    }

    public static StudentEntity mapFromCreateDto(CreateStudentDto dto) {
        StudentEntity entity = new StudentEntity();
        entity.setName(dto.getNombres());
        entity.setLastName(dto.getApellidos());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getTelefono());
        // Codificar la contraseña con BCrypt
        entity.setPassword(passwordEncoder != null ? passwordEncoder.encode(dto.getPassword()) : dto.getPassword());
        entity.setRole(Role.STUDENT.name());        entity.setActive(true); // Establecer como activo por defecto
        entity.setEmailVerified(true); // Email verificado por defecto para permitir login inmediato
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
        dto.setFechaInicio(
                entity.getEnrollmentDate() != null ? entity.getEnrollmentDate().toLocalDate() : LocalDate.now());
        
        // Mapear los cursos del estudiante
        List<Long> cursosIds = entity.getCourses() != null ? 
            entity.getCourses().stream()
                .map(course -> course.getId())
                .collect(Collectors.toList()) : 
            Collections.emptyList();
        dto.setCursos(cursosIds);
        
        return dto;
    }    
      public static StudentEntity mapFromUpdateDto(UpdateStudentDto dto, StudentEntity existingStudent) {
        StudentEntity entity = new StudentEntity();
        entity.setId(existingStudent.getId());
        entity.setName(dto.getNombres());
        entity.setLastName(dto.getApellidos());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getTelefono());
        // Codificar la contraseña con BCrypt solo si se proporciona una nueva
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            entity.setPassword(passwordEncoder != null ? passwordEncoder.encode(dto.getPassword()) : dto.getPassword());
        } else {
            entity.setPassword(existingStudent.getPassword()); // Mantener la contraseña actual
        }
        entity.setActive(dto.isActivo());
        entity.setRole(Role.STUDENT.name());
        entity.setEnrollmentDate(existingStudent.getEnrollmentDate()); // Preserve enrollment date
        entity.setCreatedAt(existingStudent.getCreatedAt()); // Preserve created at
        // Nota: Los cursos se asignan en el servicio, no en el mapper
        return entity;
    }

    public static StudentEntity mapToEntity(StudentDto dto) {
        if (dto == null) {
            return null;
        }
        
        StudentEntity entity = new StudentEntity();
        entity.setId(dto.getId());
        entity.setName(dto.getNombres());
        entity.setLastName(dto.getApellidos());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getTelefono());
        entity.setActive(dto.isActivo());
        entity.setEnrollmentDate(Date.valueOf(dto.getFechaInicio()));
        // Los cursos se asignan en el servicio, no en el mapper
        return entity;
    }   
}