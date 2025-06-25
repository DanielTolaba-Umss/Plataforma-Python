package com.coders.backers.plataformapython.backend.mapper;
import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.UpdateTeacherDto;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {

    private static PasswordEncoder passwordEncoder;

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        TeacherMapper.passwordEncoder = passwordEncoder;
    }

    public static TeacherEntity mapFromCreateDto(CreateTeacherDto dto) {
        TeacherEntity entity = new TeacherEntity();
        entity.setName(dto.getName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setRole(Role.TEACHER.name());
        // Codificar la contraseña con BCrypt
        entity.setPassword(passwordEncoder != null ? passwordEncoder.encode(dto.getPassword()) : dto.getPassword());
        entity.setSpecialty(dto.getSpecialty());        entity.setActive(true); // Establecer como activo por defecto
        entity.setEmailVerified(true); // Email verificado por defecto para permitir login inmediato
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
    }    public static TeacherEntity mapFromUpdateDto(UpdateTeacherDto dto) {
        TeacherEntity entity = new TeacherEntity();
        entity.setName(dto.getName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setRole(Role.TEACHER.name());
        // Codificar la contraseña con BCrypt solo si se proporciona una nueva
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            entity.setPassword(passwordEncoder != null ? passwordEncoder.encode(dto.getPassword()) : dto.getPassword());
        }
        entity.setSpecialty(dto.getSpecialty());
        entity.setActive(dto.isActive());
        return entity;
    }
}