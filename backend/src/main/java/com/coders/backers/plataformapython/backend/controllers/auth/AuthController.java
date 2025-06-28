package com.coders.backers.plataformapython.backend.controllers.auth;

import com.coders.backers.plataformapython.backend.dto.auth.AuthResponse;
import com.coders.backers.plataformapython.backend.dto.auth.ChangePasswordRequest;
import com.coders.backers.plataformapython.backend.dto.auth.LoginRequest;
import com.coders.backers.plataformapython.backend.dto.auth.RefreshTokenRequest;
import com.coders.backers.plataformapython.backend.services.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

//Comentario para añadir un commit

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Autenticación", description = "Endpoints para autenticación y autorización")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve tokens JWT")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Intento de login para email: {}", loginRequest.getEmail());
        
        AuthResponse response = authService.login(loginRequest);
        
        log.info("Login exitoso para email: {}", loginRequest.getEmail());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Renovar token", description = "Renueva el access token usando el refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshRequest) {
        log.info("Solicitando renovación de token");
        
        AuthResponse response = authService.refreshToken(refreshRequest.getRefreshToken());
        
        log.info("Token renovado exitosamente");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cerrar sesión", description = "Invalida los tokens del usuario (implementación simple)")
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        log.info("Solicitud de logout recibida");
        
        // En nuestro enfoque simplificado, el logout es manejado por el frontend
        // eliminando los tokens del localStorage
        
        return ResponseEntity.ok("Logout exitoso. Elimina los tokens del cliente.");
    }

    @Operation(summary = "Verificar token", description = "Verifica si el token actual es válido")
    @GetMapping("/verify")
    public ResponseEntity<String> verifyToken() {
        // Si llega hasta aquí, significa que el token es válido
        // (pasó por el JwtAuthenticationFilter)
        return ResponseEntity.ok("Token válido");
    }

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
}
