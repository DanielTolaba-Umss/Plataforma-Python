package com.coders.backers.plataformapython.backend.dto.admin;

import com.coders.backers.plataformapython.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request para crear un nuevo usuario")
public class CreateUserRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Schema(description = "Nombre del usuario", example = "Juan")
    private String name;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @Schema(description = "Apellido del usuario", example = "Pérez")
    private String lastName;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    @Schema(description = "Email del usuario", example = "juan.perez@example.com")
    private String email;
    
    @Size(max = 20, message = "El teléfono no debe exceder 20 caracteres")
    @Schema(description = "Teléfono del usuario", example = "123456789")
    private String phone;
      @NotNull(message = "El rol es obligatorio")
    @Schema(description = "Rol del usuario", example = "STUDENT")
    private Role role;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    @Schema(description = "Contraseña del usuario", example = "password123")
    private String password;
    
    // Campos específicos para Admin
    @Schema(description = "Permisos especiales para administradores", example = "ALL_PERMISSIONS")
    private String specialPermits;
      // Campos específicos para Teacher
    @Schema(description = "Especialidad para docentes", example = "Programación Python")
    private String specialty;
    
    // Los usuarios creados por admin siempre están verificados
    @Schema(description = "Si el usuario debe estar activo", example = "true")
    @Builder.Default
    private boolean active = true;
}
