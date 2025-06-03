package com.coders.backers.plataformapython.backend.controllers.auth;

import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import com.coders.backers.plataformapython.backend.services.email.EmailService;
import com.coders.backers.plataformapython.backend.services.email.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/email")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Email Verification", description = "API para verificación de email y reset de contraseñas")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Verificar email usando token
     */
    @GetMapping("/verify")
    @Operation(summary = "Verificar email con token", description = "Verifica el email del usuario usando el token enviado por correo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email verificado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Token inválido o expirado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Map<String, Object>> verifyEmail(
            @Parameter(description = "Token de verificación") @RequestParam String token) {
        
        log.info("Procesando verificación de email con token: {}...", token.substring(0, Math.min(token.length(), 8)));
        
        try {
            // Validar el token
            if (!emailVerificationService.validateVerificationToken(token)) {
                log.warn("Token de verificación inválido o expirado");
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Token de verificación inválido o expirado",
                        "error", "INVALID_TOKEN"
                    ));
            }

            // Obtener el usuario asociado al token
            UserEntity user = emailVerificationService.getUserByVerificationToken(token);
            if (user == null) {
                log.warn("Usuario no encontrado para el token de verificación");
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Usuario no encontrado",
                        "error", "USER_NOT_FOUND"
                    ));
            }

            // Verificar el email del usuario
            if (user.isEmailVerified()) {
                log.info("Email ya estaba verificado para usuario: {}", user.getEmail());
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "El email ya estaba verificado",
                    "user", Map.of(
                        "email", user.getEmail(),
                        "name", user.getName(),
                        "verified", true
                    )
                ));
            }

            user.setEmailVerified(true);
            user.setUpdatedAt(Date.valueOf(LocalDate.now()));
            userRepository.save(user);

            // Verificar el token para invalidarlo
            emailVerificationService.verifyEmailWithToken(token);

            log.info("Email verificado exitosamente para usuario: {}", user.getEmail());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email verificado exitosamente",
                "user", Map.of(
                    "email", user.getEmail(),
                    "name", user.getName(),
                    "verified", true
                )
            ));

        } catch (Exception e) {
            log.error("Error verificando email: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "message", "Error interno del servidor",
                    "error", "INTERNAL_ERROR"
                ));
        }
    }

    /**
     * Solicitar reset de contraseña
     */
    @PostMapping("/password-reset/request")
    @Operation(summary = "Solicitar reset de contraseña", description = "Envía un email con token para resetear la contraseña")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email de reset enviado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error enviando email")
    })
    public ResponseEntity<Map<String, Object>> requestPasswordReset(
            @Parameter(description = "Email del usuario") @RequestParam String email) {
        
        log.info("Solicitando reset de contraseña para email: {}", email);
        
        try {
            // Buscar usuario por email
            UserEntity user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                log.warn("Usuario no encontrado con email: {}", email);
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Usuario no encontrado",
                        "error", "USER_NOT_FOUND"
                    ));
            }

            // Generar token de reset
            String resetToken = emailVerificationService.generatePasswordResetToken(user);
            
            // Enviar email de reset
            emailService.sendPasswordResetEmail(user, resetToken);
            
            log.info("Email de reset de contraseña enviado a: {}", email);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de recuperación enviado exitosamente",
                "email", email
            ));

        } catch (Exception e) {
            log.error("Error solicitando reset de contraseña para {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "message", "Error enviando email de recuperación",
                    "error", "EMAIL_SEND_ERROR"
                ));
        }
    }

    /**
     * Validar token de reset de contraseña
     */
    @GetMapping("/password-reset/validate")
    @Operation(summary = "Validar token de reset", description = "Valida si un token de reset de contraseña es válido")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token validado"),
        @ApiResponse(responseCode = "400", description = "Token inválido o expirado")
    })
    public ResponseEntity<Map<String, Object>> validatePasswordResetToken(
            @Parameter(description = "Token de reset") @RequestParam String token) {
        
        log.info("Validando token de reset: {}...", token.substring(0, Math.min(token.length(), 8)));
        
        try {
            boolean isValid = emailVerificationService.validatePasswordResetToken(token);
            
            if (isValid) {
                UserEntity user = emailVerificationService.getUserByPasswordResetToken(token);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "valid", true,
                    "message", "Token válido",
                    "user", Map.of(
                        "email", user.getEmail(),
                        "name", user.getName()
                    )
                ));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "valid", false,
                        "message", "Token inválido o expirado",
                        "error", "INVALID_TOKEN"
                    ));
            }

        } catch (Exception e) {
            log.error("Error validando token de reset: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "valid", false,
                    "message", "Error validando token",
                    "error", "VALIDATION_ERROR"
                ));
        }
    }

    /**
     * Resetear contraseña con token
     */
    @PostMapping("/password-reset/confirm")
    @Operation(summary = "Resetear contraseña", description = "Resetea la contraseña usando el token válido")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña reseteada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Token inválido o datos incorrectos"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody Map<String, String> request) {
        
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        
        log.info("Reseteando contraseña con token: {}...", token.substring(0, Math.min(token.length(), 8)));
        
        try {
            // Validar parámetros
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Token requerido",
                        "error", "MISSING_TOKEN"
                    ));
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Nueva contraseña requerida",
                        "error", "MISSING_PASSWORD"
                    ));
            }

            // Validar token
            if (!emailVerificationService.validatePasswordResetToken(token)) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Token inválido o expirado",
                        "error", "INVALID_TOKEN"
                    ));
            }

            // Obtener usuario
            UserEntity user = emailVerificationService.getUserByPasswordResetToken(token);
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Usuario no encontrado",
                        "error", "USER_NOT_FOUND"
                    ));
            }

            // Actualizar contraseña
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setUpdatedAt(Date.valueOf(LocalDate.now()));
            userRepository.save(user);

            // Invalidar el token después del uso exitoso
            emailVerificationService.invalidatePasswordResetToken(token);
            
            // Enviar notificación de cambio de contraseña
            try {
                emailService.sendPasswordChangeNotification(user);
                log.info("Notificación de cambio de contraseña enviada a: {}", user.getEmail());
            } catch (Exception e) {
                log.warn("Error enviando notificación de cambio de contraseña: {}", e.getMessage());
                // No interrumpir el flujo
            }

            log.info("Contraseña reseteada exitosamente para usuario: {}", user.getEmail());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Contraseña actualizada exitosamente",
                "user", Map.of(
                    "email", user.getEmail(),
                    "name", user.getName()
                )
            ));

        } catch (Exception e) {
            log.error("Error reseteando contraseña: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "message", "Error interno del servidor",
                    "error", "INTERNAL_ERROR"
                ));
        }
    }

    /**
     * Reenviar email de verificación
     */
    @PostMapping("/verification/resend")
    @Operation(summary = "Reenviar email de verificación", description = "Reenvía el email de verificación para un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email reenviado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Email ya verificado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Map<String, Object>> resendVerificationEmail(
            @Parameter(description = "Email del usuario") @RequestParam String email) {
        
        log.info("Reenviando email de verificación para: {}", email);
        
        try {
            // Buscar usuario
            UserEntity user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Usuario no encontrado",
                        "error", "USER_NOT_FOUND"
                    ));
            }

            // Verificar si ya está verificado
            if (user.isEmailVerified()) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "El email ya está verificado",
                        "error", "ALREADY_VERIFIED"
                    ));
            }

            // Generar nuevo token y enviar email
            String verificationToken = emailVerificationService.generateVerificationToken(user);
            emailService.sendVerificationEmail(user, verificationToken);

            log.info("Email de verificación reenviado a: {}", email);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de verificación reenviado exitosamente",
                "email", email
            ));

        } catch (Exception e) {
            log.error("Error reenviando email de verificación para {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "message", "Error reenviando email de verificación",
                    "error", "EMAIL_SEND_ERROR"
                ));
        }
    }
}
