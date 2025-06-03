package com.coders.backers.plataformapython.backend.controllers.auth;

import com.coders.backers.plataformapython.backend.dto.auth.AuthResponse;
import com.coders.backers.plataformapython.backend.dto.auth.LoginRequest;
import com.coders.backers.plataformapython.backend.dto.auth.RefreshTokenRequest;
import com.coders.backers.plataformapython.backend.services.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
