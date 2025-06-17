package com.coders.backers.plataformapython.backend.services.email.impl;

import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.services.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.util.Objects;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.email.verification.base-url}")
    private String baseUrl;    @Override
    public void sendVerificationEmail(UserEntity user, String verificationToken) {
        Objects.requireNonNull(user, "El usuario no puede ser null");
        if (verificationToken == null || verificationToken.trim().isEmpty()) {
            throw new IllegalArgumentException("El token de verificación no puede ser null o vacío");
        }
        
        log.info("Enviando email de verificación a: {}", user.getEmail());
        
        try {
            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("verificationLink", baseUrl + "/verify-email?token=" + verificationToken);
            context.setVariable("platformName", "Plataforma Python");
            
            String content = templateEngine.process("email/verification", context);
            
            sendHtmlEmail(user.getEmail(), "Verifica tu cuenta - Plataforma Python", content);
            
            log.info("Email de verificación enviado exitosamente a: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error enviando email de verificación a {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Error enviando email de verificación", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(UserEntity user, String resetToken) {
        log.info("Enviando email de recuperación de contraseña a: {}", user.getEmail());
        
        try {
            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("resetLink", baseUrl + "/reset-password?token=" + resetToken);
            context.setVariable("platformName", "Plataforma Python");
            
            String content = templateEngine.process("email/password-reset", context);
            
            sendHtmlEmail(user.getEmail(), "Recuperar contraseña - Plataforma Python", content);
            
            log.info("Email de recuperación enviado exitosamente a: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error enviando email de recuperación a {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Error enviando email de recuperación", e);
        }
    }

    @Override
    public void sendWelcomeEmail(UserEntity user) {
        log.info("Enviando email de bienvenida a: {}", user.getEmail());
        
        try {
            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("userRole", user.getRole());
            context.setVariable("platformName", "Plataforma Python");
            context.setVariable("loginUrl", baseUrl + "/login");
            
            String content = templateEngine.process("email/welcome", context);
            
            sendHtmlEmail(user.getEmail(), "¡Bienvenido a Plataforma Python!", content);
            
            log.info("Email de bienvenida enviado exitosamente a: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error enviando email de bienvenida a {}: {}", user.getEmail(), e.getMessage());
            // No lanzamos excepción aquí para que no interrumpa el flujo principal
        }
    }

    @Override
    public void sendWelcomeEmailWithCredentials(UserEntity user, String password) {
        log.info("Enviando email de bienvenida con credenciales a: {}", user.getEmail());
        
        try {
            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("userRole", user.getRole());
            context.setVariable("userEmail", user.getEmail());
            context.setVariable("userPassword", password);
            context.setVariable("platformName", "Plataforma Python");
            context.setVariable("loginUrl", baseUrl + "/login");
            
            String content = templateEngine.process("email/welcome-with-credentials", context);
            
            sendHtmlEmail(user.getEmail(), "¡Bienvenido a Plataforma Python! - Credenciales de acceso", content);
            
            log.info("Email de bienvenida con credenciales enviado exitosamente a: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error enviando email de bienvenida con credenciales a {}: {}", user.getEmail(), e.getMessage());
            // No lanzamos excepción aquí para que no interrumpa el flujo principal
        }
    }

    @Override
    public void sendPasswordChangeNotification(UserEntity user) {
        log.info("Enviando notificación de cambio de contraseña a: {}", user.getEmail());
        
        try {
            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("platformName", "Plataforma Python");
            context.setVariable("supportEmail", fromEmail);
            
            String content = templateEngine.process("email/password-change", context);
            
            sendHtmlEmail(user.getEmail(), "Contraseña actualizada - Plataforma Python", content);
            
            log.info("Notificación de cambio de contraseña enviada exitosamente a: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error enviando notificación de cambio de contraseña a {}: {}", user.getEmail(), e.getMessage());
            // No lanzamos excepción aquí para que no interrumpa el flujo principal
        }
    }

    @Override
    public void sendSimpleEmail(String to, String subject, String message) {
        log.info("Enviando email simple a: {}", to);
        
        try {
            Context context = new Context();
            context.setVariable("message", message);
            context.setVariable("platformName", "Plataforma Python");
            
            String content = templateEngine.process("email/simple", context);
            
            sendHtmlEmail(to, subject, content);
            
            log.info("Email simple enviado exitosamente a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando email simple a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error enviando email", e);
        }
    }

    @Override
    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> templateVariables) {
        log.info("Enviando email con template {} a: {}", templateName, to);
        
        try {
            Context context = new Context();
            context.setVariable("platformName", "Plataforma Python");
            
            // Agregar todas las variables del template
            if (templateVariables != null) {
                templateVariables.forEach(context::setVariable);
            }
            
            String content = templateEngine.process("email/" + templateName, context);
            
            sendHtmlEmail(to, subject, content);
            
            log.info("Email con template {} enviado exitosamente a: {}", templateName, to);
        } catch (Exception e) {
            log.error("Error enviando email con template {} a {}: {}", templateName, to, e.getMessage());
            throw new RuntimeException("Error enviando email con template", e);
        }
    }

    /**
     * Método privado para enviar emails HTML
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
}
