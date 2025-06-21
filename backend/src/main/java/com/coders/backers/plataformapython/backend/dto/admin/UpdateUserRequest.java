package com.coders.backers.plataformapython.backend.dto.admin;

import com.coders.backers.plataformapython.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request para actualizar un usuario existente")
public class UpdateUserRequest {
    
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Schema(description = "Nombre del usuario", example = "Juan")
    private String name;
    
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @Schema(description = "Apellido del usuario", example = "Pérez")
    private String lastName;
    
    @Email(message = "El email debe ser válido")
    @Schema(description = "Email del usuario", example = "juan.perez@example.com")
    private String email;
    
    @Size(max = 20, message = "El teléfono no debe exceder 20 caracteres")
    @Schema(description = "Teléfono del usuario", example = "123456789")
    private String phone;
    
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    @Schema(description = "Nueva contraseña del usuario (opcional)", example = "newpassword123")
    private String password;
    
    // Campos específicos para Admin
    @Schema(description = "Permisos especiales para administradores", example = "ALL_PERMISSIONS")
    private String specialPermits;
    
    // Campos específicos para Teacher
    @Schema(description = "Especialidad para docentes", example = "Programación Python")
    private String specialty;
    
    @Schema(description = "Si el email debe marcarse como verificado", example = "true")
    private Boolean emailVerified;
    
    @Schema(description = "Si el usuario debe estar activo", example = "true")
    private Boolean active;
}
