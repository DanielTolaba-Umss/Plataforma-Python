package com.coders.backers.plataformapython.backend.controllers.user;

import com.coders.backers.plataformapython.backend.dto.auth.ChangePasswordRequest;
import com.coders.backers.plataformapython.backend.services.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Usuario", description = "Endpoints para gestión de perfil de usuario")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final AuthService authService;

    @Operation(summary = "Cambiar contraseña", description = "Permite al usuario cambiar su propia contraseña")
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {
        log.info("Solicitando cambio de contraseña para usuario: {}", authentication.getName());
        
        try {
            authService.changePassword(authentication.getName(), changePasswordRequest);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Contraseña cambiada exitosamente"
            ));
        } catch (IllegalArgumentException e) {
            log.warn("Error de validación en cambio de contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage(),
                "error", "VALIDATION_ERROR"
            ));
        } catch (BadCredentialsException e) {
            log.warn("Contraseña actual incorrecta para usuario: {}", authentication.getName());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "La contraseña actual es incorrecta",
                "error", "INVALID_CURRENT_PASSWORD"
            ));
        } catch (Exception e) {
            log.error("Error interno cambiando contraseña: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error interno del servidor",
                "error", "INTERNAL_ERROR"
            ));
        }
    }

    @Operation(summary = "Obtener perfil", description = "Obtiene la información del perfil del usuario autenticado")
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        log.info("Solicitando perfil para usuario: {}", authentication.getName());
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "email", authentication.getName(),
            "authorities", authentication.getAuthorities()
        ));
    }
}
