package com.coders.backers.plataformapython.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    /**
     * Configuración del encoder de contraseñas usando BCrypt
     * BCrypt es un algoritmo de hash adaptativo que incluye salt automáticamente
     * y es resistente a ataques de fuerza bruta
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Strength 12 es un buen balance entre seguridad y performance
    }
}
