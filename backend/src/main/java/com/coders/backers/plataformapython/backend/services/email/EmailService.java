package com.coders.backers.plataformapython.backend.services.email;

import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;

/**
 * Servicio para envío de emails
 */
public interface EmailService {
    
    /**
     * Envía email de verificación de cuenta
     */
    void sendVerificationEmail(UserEntity user, String verificationToken);
    
    /**
     * Envía email de recuperación de contraseña
     */
    void sendPasswordResetEmail(UserEntity user, String resetToken);
    
    /**
     * Envía email de bienvenida
     */
    void sendWelcomeEmail(UserEntity user);
    
    /**
     * Envía email de notificación de cambio de contraseña
     */
    void sendPasswordChangeNotification(UserEntity user);
    
    /**
     * Envía email simple con template básico
     */
    void sendSimpleEmail(String to, String subject, String message);
    
    /**
     * Envía email con template personalizado
     */
    void sendTemplateEmail(String to, String subject, String templateName, 
                          java.util.Map<String, Object> templateVariables);
}
