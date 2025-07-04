package com.coders.backers.plataformapython.backend.services.auth;

import com.coders.backers.plataformapython.backend.dto.auth.AuthResponse;
import com.coders.backers.plataformapython.backend.dto.auth.ChangePasswordRequest;
import com.coders.backers.plataformapython.backend.dto.auth.LoginRequest;
import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import com.coders.backers.plataformapython.backend.services.security.JwtService;
import com.coders.backers.plataformapython.backend.services.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.access-expiry}")
    private long accessTokenExpiry;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Autenticar al usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Obtener el usuario autenticado
            UserEntity user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            // Generar tokens
            var userDetails = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            log.info("Tokens generados para usuario: {}", user.getEmail());

            // Construir respuesta
            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(accessTokenExpiry / 1000) // Convertir a segundos
                    .user(AuthResponse.UserInfo.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .emailVerified(user.isEmailVerified())
                            .build())
                    .build();

        } catch (BadCredentialsException e) {
            log.warn("Intento de login fallido para email: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        try {
            // Extraer email del refresh token
            String userEmail = jwtService.extractUsername(refreshToken);
            
            // Buscar usuario
            UserEntity user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            // Verificar que el usuario esté activo
            if (!user.isActive()) {
                throw new SecurityException("Usuario inactivo");
            }

            // Crear UserDetails para generar nuevo token
            var userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities("ROLE_" + user.getRole())
                    .build();

            // Validar refresh token
            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                throw new SecurityException("Refresh token inválido");
            }

            // Generar nuevos tokens
            String newAccessToken = jwtService.generateAccessToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);

            log.info("Tokens renovados para usuario: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(accessTokenExpiry / 1000)
                    .user(AuthResponse.UserInfo.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .emailVerified(user.isEmailVerified())
                            .build())
                    .build();

        } catch (Exception e) {
            log.error("Error renovando token: {}", e.getMessage());
            throw new SecurityException("Error renovando token: " + e.getMessage());
        }
    }    public void changePassword(String userEmail, ChangePasswordRequest changePasswordRequest) {
        log.info("Iniciando cambio de contraseña para usuario: {}", userEmail);
        
        try {
            // Validar que las contraseñas nuevas coincidan
            if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
                throw new IllegalArgumentException("Las contraseñas nuevas no coinciden");
            }
            
            // Buscar el usuario
            UserEntity user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
            
            // Verificar la contraseña actual
            if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
                throw new BadCredentialsException("La contraseña actual es incorrecta");
            }
            
            // Actualizar la contraseña
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            user.setUpdatedAt(java.sql.Date.valueOf(java.time.LocalDate.now()));
            userRepository.save(user);
            
            // Enviar notificación por email
            try {
                emailService.sendPasswordChangeNotification(user);
                log.info("Notificación de cambio de contraseña enviada a: {}", user.getEmail());
            } catch (Exception e) {
                log.warn("Error enviando notificación de cambio de contraseña: {}", e.getMessage());
                // No interrumpir el flujo
            }
            
            log.info("Contraseña cambiada exitosamente para usuario: {}", user.getEmail());
            
        } catch (Exception e) {
            log.error("Error cambiando contraseña para usuario {}: {}", userEmail, e.getMessage());
            throw e;
        }
    }
}
