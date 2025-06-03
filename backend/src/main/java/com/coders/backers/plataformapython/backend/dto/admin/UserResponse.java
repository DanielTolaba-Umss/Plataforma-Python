package com.coders.backers.plataformapython.backend.dto.admin;

import com.coders.backers.plataformapython.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response con información completa del usuario")
public class UserResponse {
    
    @Schema(description = "ID único del usuario", example = "1")
    private Long id;
    
    @Schema(description = "Nombre del usuario", example = "Juan")
    private String name;
    
    @Schema(description = "Apellido del usuario", example = "Pérez")
    private String lastName;
    
    @Schema(description = "Email del usuario", example = "juan.perez@example.com")
    private String email;
    
    @Schema(description = "Teléfono del usuario", example = "123456789")
    private String phone;
      @Schema(description = "Rol del usuario", example = "STUDENT")
    private Role role;
    
    @Schema(description = "Si el usuario está activo", example = "true")
    private boolean active;
    
    @Schema(description = "Si el email está verificado", example = "true")
    private boolean emailVerified;
    
    @Schema(description = "Fecha de creación", example = "2025-06-02T19:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Fecha de última actualización", example = "2025-06-02T19:30:00")
    private LocalDateTime updatedAt;
    
    // Campos específicos para Admin
    @Schema(description = "Permisos especiales para administradores", example = "ALL_PERMISSIONS")
    private String specialPermits;
    
    // Campos específicos para Teacher
    @Schema(description = "Especialidad para docentes", example = "Programación Python")
    private String specialty;
}
