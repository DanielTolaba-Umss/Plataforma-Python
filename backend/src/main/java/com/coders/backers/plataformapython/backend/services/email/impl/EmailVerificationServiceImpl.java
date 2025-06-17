package com.coders.backers.plataformapython.backend.services.email.impl;

import com.coders.backers.plataformapython.backend.config.EmbeddedRedisConfig;
import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import com.coders.backers.plataformapython.backend.services.email.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    
    // Soporte opcional para Redis embebido
    @Autowired(required = false)
    private EmbeddedRedisConfig.EmbeddedRedisService embeddedRedisService;

    @Value("${app.email.verification.expiry:86400000}") // 24 horas por defecto
    private long verificationTokenExpiry;

    private static final String VERIFICATION_TOKEN_PREFIX = "verify:";
    private static final String PASSWORD_RESET_TOKEN_PREFIX = "reset:";
    private static final SecureRandom secureRandom = new SecureRandom();    @Override
    public String generateVerificationToken(UserEntity user) {
        log.info("Generando token de verificación para usuario: {}", user.getEmail());
        
        String token = generateSecureToken();
        String redisKey = VERIFICATION_TOKEN_PREFIX + token;
        
        // Usar Redis embebido si está disponible, sino Redis normal
        if (embeddedRedisService != null) {
            embeddedRedisService.setWithExpiration(redisKey, user.getId(), verificationTokenExpiry, TimeUnit.MILLISECONDS);
        } else {
            redisTemplate.opsForValue().set(redisKey, user.getId(), verificationTokenExpiry, TimeUnit.MILLISECONDS);
        }
        
        log.info("Token de verificación generado exitosamente para usuario: {}", user.getEmail());
        return token;
    }

    @Override
    public String generatePasswordResetToken(UserEntity user) {
        log.info("Generando token de recuperación de contraseña para usuario: {}", user.getEmail());
        
        String token = generateSecureToken();
        String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
        
        // Guardar el token con expiración (1 hora para reset)
        long resetTokenExpiry = 3600000; // 1 hora
        if (embeddedRedisService != null) {
            embeddedRedisService.setWithExpiration(redisKey, user.getId(), resetTokenExpiry, TimeUnit.MILLISECONDS);
        } else {
            redisTemplate.opsForValue().set(redisKey, user.getId(), resetTokenExpiry, TimeUnit.MILLISECONDS);
        }
        
        log.info("Token de recuperación generado exitosamente para usuario: {}", user.getEmail());
        return token;
    }    @Override
    public boolean validateVerificationToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            log.debug("Token de verificación nulo o vacío");
            return false;
        }
        
        log.debug("Validando token de verificación: {}", token.substring(0, Math.min(token.length(), 8)) + "...");
        
        String redisKey = VERIFICATION_TOKEN_PREFIX + token;
        Object userId = getFromRedis(redisKey);
        
        boolean isValid = userId != null;
        log.debug("Token de verificación válido: {}", isValid);
        
        return isValid;
    }

    @Override
    public boolean validatePasswordResetToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            log.debug("Token de recuperación nulo o vacío");
            return false;
        }
        
        log.debug("Validando token de recuperación: {}", token.substring(0, Math.min(token.length(), 8)) + "...");
        
        String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
        Object userId = getFromRedis(redisKey);
        
        boolean isValid = userId != null;
        log.debug("Token de recuperación válido: {}", isValid);
        
        return isValid;
    }

    @Override
    public UserEntity getUserByVerificationToken(String token) {
        log.debug("Obteniendo usuario por token de verificación");
        
        String redisKey = VERIFICATION_TOKEN_PREFIX + token;
        Object userId = getFromRedis(redisKey);
        
        if (userId == null) {
            log.warn("Token de verificación no encontrado o expirado");
            return null;
        }
        
        return userRepository.findById(Long.valueOf(userId.toString()))
            .orElse(null);
    }

    @Override
    public UserEntity getUserByPasswordResetToken(String token) {
        log.debug("Obteniendo usuario por token de recuperación");
        
        String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
        Object userId = getFromRedis(redisKey);
        
        if (userId == null) {
            log.warn("Token de recuperación no encontrado o expirado");
            return null;
        }
        
        return userRepository.findById(Long.valueOf(userId.toString()))
            .orElse(null);
    }

    @Override
    public boolean verifyEmailWithToken(String token) {
        log.info("Verificando email con token");
        
        UserEntity user = getUserByVerificationToken(token);
        if (user == null) {
            log.warn("No se pudo verificar email: token inválido o expirado");
            return false;
        }
        
        // Marcar email como verificado
        user.setEmailVerified(true);
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        userRepository.save(user);
          // Eliminar el token usado
        String redisKey = VERIFICATION_TOKEN_PREFIX + token;
        deleteFromRedis(redisKey);
        
        log.info("Email verificado exitosamente para usuario: {}", user.getEmail());
        return true;
    }

    @Override
    public void cleanExpiredTokens() {
        log.info("Limpiando tokens expirados...");
        
        // Redis maneja automáticamente la expiración de tokens
        // Este método puede usarse para limpiezas manuales si es necesario
        
        log.info("Limpieza de tokens completada");
    }

    @Override
    public void invalidatePasswordResetToken(String token) {
        log.info("Invalidando token de recuperación de contraseña");
        String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
        deleteFromRedis(redisKey);
        log.info("Token de recuperación invalidado exitosamente");
    }

    /**
     * Método auxiliar para obtener valores de Redis (embebido o normal)
     */
    private Object getFromRedis(String key) {
        if (embeddedRedisService != null) {
            return embeddedRedisService.get(key);
        } else {
            return redisTemplate.opsForValue().get(key);
        }
    }
    
    /**
     * Método auxiliar para eliminar valores de Redis (embebido o normal)
     */
    private void deleteFromRedis(String key) {
        if (embeddedRedisService != null) {
            embeddedRedisService.delete(key);
        } else {
            redisTemplate.delete(key);
        }
    }

    /**
     * Genera un token seguro aleatorio
     */
    private String generateSecureToken() {
        // Combinar UUID con datos aleatorios para mayor seguridad
        String uuid = UUID.randomUUID().toString().replace("-", "");
        
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);
        String randomString = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        
        return uuid + randomString;
    }
}
