package com.coders.backers.plataformapython.backend.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request para reset de contraseña con token")
public class ResetPasswordRequest {
    
    @NotBlank(message = "El token es obligatorio")
    @Schema(description = "Token de recuperación de contraseña", example = "abc123...")
    private String token;
    
    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    @Schema(description = "Nueva contraseña", example = "NuevaPassword123!")
    private String newPassword;
}
