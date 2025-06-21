package com.coders.backers.plataformapython.backend.services.email;

import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;

/**
 * Servicio para manejo de tokens de verificación de email
 */
public interface EmailVerificationService {
    
    /**
     * Genera un token de verificación para un usuario
     */
    String generateVerificationToken(UserEntity user);
    
    /**
     * Genera un token de recuperación de contraseña
     */
    String generatePasswordResetToken(UserEntity user);
    
    /**
     * Valida un token de verificación de email
     */
    boolean validateVerificationToken(String token);
    
    /**
     * Valida un token de recuperación de contraseña
     */
    boolean validatePasswordResetToken(String token);
    
    /**
     * Obtiene el usuario asociado a un token de verificación
     */
    UserEntity getUserByVerificationToken(String token);
    
    /**
     * Obtiene el usuario asociado a un token de recuperación
     */
    UserEntity getUserByPasswordResetToken(String token);
    
    /**
     * Verifica el email de un usuario usando un token
     */
    boolean verifyEmailWithToken(String token);
    
    /**
     * Invalida un token de recuperación de contraseña
     */
    void invalidatePasswordResetToken(String token);
    
    /**
     * Limpia tokens expirados
     */
    void cleanExpiredTokens();
}
