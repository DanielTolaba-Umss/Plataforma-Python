package com.coders.backers.plataformapython.backend.service.email;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.coders.backers.plataformapython.backend.models.userModel.AdminEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.services.email.impl.EmailServiceImpl;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailServiceImpl emailService;

    private UserEntity testUser;
    private String testToken = "test-token-123";

    @BeforeEach
    void setUp() {
        // Configurar propiedades usando ReflectionTestUtils
        ReflectionTestUtils.setField(emailService, "fromEmail", "test@plataforma.com");
        ReflectionTestUtils.setField(emailService, "baseUrl", "http://localhost:3000");

        // Crear usuario de prueba
        testUser = new StudentEntity();
        testUser.setId(1L);
        testUser.setName("Juan");
        testUser.setLastName("Pérez");
        testUser.setEmail("juan.perez@test.com");
        testUser.setRole("STUDENT");

        // Configurar mocks
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Test Email</html>");
    }

    @Test
    void testSendVerificationEmail_Success() {
        // Act
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(testUser, testToken);
        });

        // Assert
        verify(templateEngine).process(eq("email/verification"), any(Context.class));
        verify(mailSender).send(any(MimeMessage.class));
    }

    @Test
    void testSendVerificationEmail_WithNullUser_ThrowsException() {
        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            emailService.sendVerificationEmail(null, testToken);
        });
    }

    @Test
    void testSendVerificationEmail_WithNullToken_ThrowsException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendVerificationEmail(testUser, null);
        });
    }

    @Test
    void testSendPasswordResetEmail_Success() {
        // Act
        assertDoesNotThrow(() -> {
            emailService.sendPasswordResetEmail(testUser, testToken);
        });

        // Assert
        verify(templateEngine).process(eq("email/password-reset"), any(Context.class));
        verify(mailSender).send(any(MimeMessage.class));
    }

    @Test
    void testSendWelcomeEmail_Success() {
        // Act
        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail(testUser);
        });

        // Assert
        verify(templateEngine).process(eq("email/welcome"), any(Context.class));
        verify(mailSender).send(any(MimeMessage.class));
    }

    @Test
    void testSendPasswordChangeNotification_Success() {
        // Act
        assertDoesNotThrow(() -> {
            emailService.sendPasswordChangeNotification(testUser);
        });

        // Assert
        verify(templateEngine).process(eq("email/password-change"), any(Context.class));
        verify(mailSender).send(any(MimeMessage.class));
    }

    @Test
    void testSendSimpleEmail_Success() {
        String subject = "Test Subject";
        String message = "Test Message";

        // Act
        assertDoesNotThrow(() -> {
            emailService.sendSimpleEmail(testUser.getEmail(), subject, message);
        });

        // Assert
        verify(templateEngine).process(eq("email/simple"), any(Context.class));
        verify(mailSender).send(any(MimeMessage.class));
    }    @Test
    void testSendVerificationEmail_MailException_ThrowsRuntimeException() {
        // Arrange
        doThrow(new RuntimeException("Mail server error")).when(mailSender).send(any(MimeMessage.class));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            emailService.sendVerificationEmail(testUser, testToken);
        });

        assertTrue(exception.getMessage().contains("Error enviando email de verificación"));
    }    @Test
    void testSendPasswordResetEmail_MailException_ThrowsRuntimeException() {
        // Arrange
        doThrow(new RuntimeException("Mail server error")).when(mailSender).send(any(MimeMessage.class));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            emailService.sendPasswordResetEmail(testUser, testToken);
        });

        assertTrue(exception.getMessage().contains("Error enviando email de recuperación"));
    }    @Test
    void testWelcomeEmailWithDifferentRoles() {
        // Test con Student (testUser)
        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail(testUser);
        });

        // Test con Admin
        UserEntity admin = new AdminEntity();
        admin.setId(2L);
        admin.setName("Admin");
        admin.setLastName("Test");
        admin.setEmail("admin@test.com");
        admin.setRole("ADMIN");

        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail(admin);
        });

        // Test con Teacher
        UserEntity teacher = new TeacherEntity();
        teacher.setId(3L);
        teacher.setName("Teacher");
        teacher.setLastName("Test");
        teacher.setEmail("teacher@test.com");
        teacher.setRole("TEACHER");

        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail(teacher);
        });

        // Verificar que se llama al template engine para cada rol
        verify(templateEngine, times(3)).process(eq("email/welcome"), any(Context.class));
    }

    @Test
    void testEmailContextVariables() {
        // Arrange
        when(templateEngine.process(anyString(), any(Context.class))).thenAnswer(invocation -> {
            Context context = invocation.getArgument(1);
            
            // Verificar que las variables del contexto están presentes
            assertTrue(context.containsVariable("userName"));
            assertTrue(context.containsVariable("platformName"));
            
            return "<html>Test</html>";
        });

        // Act
        emailService.sendWelcomeEmail(testUser);

        // Assert
        verify(templateEngine).process(eq("email/welcome"), any(Context.class));
    }

    @Test
    void testVerificationEmailWithToken() {
        // Arrange
        when(templateEngine.process(anyString(), any(Context.class))).thenAnswer(invocation -> {
            Context context = invocation.getArgument(1);
            
            // Verificar que el token está en el contexto
            assertTrue(context.containsVariable("verificationLink"));
            String verificationLink = (String) context.getVariable("verificationLink");
            assertTrue(verificationLink.contains(testToken));
            
            return "<html>Test</html>";
        });

        // Act
        emailService.sendVerificationEmail(testUser, testToken);

        // Assert
        verify(templateEngine).process(eq("email/verification"), any(Context.class));
    }

    @Test
    void testPasswordResetEmailWithToken() {
        // Arrange
        when(templateEngine.process(anyString(), any(Context.class))).thenAnswer(invocation -> {
            Context context = invocation.getArgument(1);
            
            // Verificar que el token está en el contexto
            assertTrue(context.containsVariable("resetLink"));
            String resetLink = (String) context.getVariable("resetLink");
            assertTrue(resetLink.contains(testToken));
            
            return "<html>Test</html>";
        });

        // Act
        emailService.sendPasswordResetEmail(testUser, testToken);

        // Assert
        verify(templateEngine).process(eq("email/password-reset"), any(Context.class));
    }
}
