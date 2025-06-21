package com.coders.backers.plataformapython.backend.service.email;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import com.coders.backers.plataformapython.backend.services.email.impl.EmailVerificationServiceImpl;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EmailVerificationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private EmailVerificationServiceImpl emailVerificationService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        // Configurar propiedades usando ReflectionTestUtils
        ReflectionTestUtils.setField(emailVerificationService, "verificationTokenExpiry", 86400000L); // 24 horas

        // Crear usuario de prueba
        testUser = new StudentEntity();
        testUser.setId(1L);
        testUser.setName("Juan");
        testUser.setLastName("Pérez");
        testUser.setEmail("juan.perez@test.com");
        testUser.setRole("STUDENT");

        // Configurar mocks de Redis
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testGenerateVerificationToken_Success() {
        // Act
        String token = emailVerificationService.generateVerificationToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.length() >= 32); // Token debe ser suficientemente largo

        // Verificar que se guarda en Redis
        verify(valueOperations).set(
            startsWith("verify:"), 
            eq(testUser.getId()), 
            eq(86400000L), 
            eq(TimeUnit.MILLISECONDS)
        );
    }

    @Test
    void testGeneratePasswordResetToken_Success() {
        // Act
        String token = emailVerificationService.generatePasswordResetToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.length() >= 32); // Token debe ser suficientemente largo

        // Verificar que se guarda en Redis con expiración de 1 hora
        verify(valueOperations).set(
            startsWith("reset:"), 
            eq(testUser.getId()), 
            eq(3600000L), // 1 hora
            eq(TimeUnit.MILLISECONDS)
        );
    }

    @Test
    void testValidateVerificationToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = "valid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(testUser.getId());

        // Act
        boolean isValid = emailVerificationService.validateVerificationToken(token);

        // Assert
        assertTrue(isValid);
        verify(valueOperations).get("verify:" + token);
    }

    @Test
    void testValidateVerificationToken_InvalidToken_ReturnsFalse() {
        // Arrange
        String token = "invalid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(null);

        // Act
        boolean isValid = emailVerificationService.validateVerificationToken(token);

        // Assert
        assertFalse(isValid);
        verify(valueOperations).get("verify:" + token);
    }

    @Test
    void testValidatePasswordResetToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = "valid-reset-token-123";
        when(valueOperations.get("reset:" + token)).thenReturn(testUser.getId());

        // Act
        boolean isValid = emailVerificationService.validatePasswordResetToken(token);

        // Assert
        assertTrue(isValid);
        verify(valueOperations).get("reset:" + token);
    }

    @Test
    void testValidatePasswordResetToken_InvalidToken_ReturnsFalse() {
        // Arrange
        String token = "invalid-reset-token-123";
        when(valueOperations.get("reset:" + token)).thenReturn(null);

        // Act
        boolean isValid = emailVerificationService.validatePasswordResetToken(token);

        // Assert
        assertFalse(isValid);
        verify(valueOperations).get("reset:" + token);
    }

    @Test
    void testGetUserByVerificationToken_ValidToken_ReturnsUser() {
        // Arrange
        String token = "valid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(testUser.getId());
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // Act
        UserEntity result = emailVerificationService.getUserByVerificationToken(token);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(valueOperations).get("verify:" + token);
        verify(userRepository).findById(testUser.getId());
    }

    @Test
    void testGetUserByVerificationToken_InvalidToken_ReturnsNull() {
        // Arrange
        String token = "invalid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(null);

        // Act
        UserEntity result = emailVerificationService.getUserByVerificationToken(token);

        // Assert
        assertNull(result);
        verify(valueOperations).get("verify:" + token);
        verify(userRepository, never()).findById(any());
    }

    @Test
    void testGetUserByPasswordResetToken_ValidToken_ReturnsUser() {
        // Arrange
        String token = "valid-reset-token-123";
        when(valueOperations.get("reset:" + token)).thenReturn(testUser.getId());
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // Act
        UserEntity result = emailVerificationService.getUserByPasswordResetToken(token);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(valueOperations).get("reset:" + token);
        verify(userRepository).findById(testUser.getId());
    }

    @Test
    void testGetUserByPasswordResetToken_InvalidToken_ReturnsNull() {
        // Arrange
        String token = "invalid-reset-token-123";
        when(valueOperations.get("reset:" + token)).thenReturn(null);

        // Act
        UserEntity result = emailVerificationService.getUserByPasswordResetToken(token);

        // Assert
        assertNull(result);
        verify(valueOperations).get("reset:" + token);
        verify(userRepository, never()).findById(any());
    }

    @Test
    void testVerifyEmailWithToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = "valid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(testUser.getId());
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // Act
        boolean result = emailVerificationService.verifyEmailWithToken(token);

        // Assert
        assertTrue(result);
        assertTrue(testUser.isEmailVerified());
        verify(userRepository).save(testUser);
        verify(redisTemplate).delete("verify:" + token);
    }

    @Test
    void testVerifyEmailWithToken_InvalidToken_ReturnsFalse() {
        // Arrange
        String token = "invalid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(null);

        // Act
        boolean result = emailVerificationService.verifyEmailWithToken(token);

        // Assert
        assertFalse(result);
        verify(userRepository, never()).save(any());
        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void testVerifyEmailWithToken_UserNotFound_ReturnsFalse() {
        // Arrange
        String token = "valid-token-123";
        when(valueOperations.get("verify:" + token)).thenReturn(testUser.getId());
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());

        // Act
        boolean result = emailVerificationService.verifyEmailWithToken(token);

        // Assert
        assertFalse(result);
        verify(userRepository, never()).save(any());
        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void testCleanExpiredTokens_Success() {
        // Act
        assertDoesNotThrow(() -> {
            emailVerificationService.cleanExpiredTokens();
        });

        // Note: La implementación actual no hace nada específico,
        // pero el método debe existir para limpieza futura
    }

    @Test
    void testGenerateTokensAreUnique() {
        // Act
        String token1 = emailVerificationService.generateVerificationToken(testUser);
        String token2 = emailVerificationService.generateVerificationToken(testUser);

        // Assert
        assertNotEquals(token1, token2);
    }

    @Test
    void testGenerateVerificationToken_WithNullUser_ThrowsException() {
        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            emailVerificationService.generateVerificationToken(null);
        });
    }

    @Test
    void testGeneratePasswordResetToken_WithNullUser_ThrowsException() {
        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            emailVerificationService.generatePasswordResetToken(null);
        });
    }

    @Test
    void testValidateTokenWithEmptyString_ReturnsFalse() {
        // Act
        boolean verificationResult = emailVerificationService.validateVerificationToken("");
        boolean resetResult = emailVerificationService.validatePasswordResetToken("");

        // Assert
        assertFalse(verificationResult);
        assertFalse(resetResult);
    }

    @Test
    void testValidateTokenWithNullString_ReturnsFalse() {
        // Act
        boolean verificationResult = emailVerificationService.validateVerificationToken(null);
        boolean resetResult = emailVerificationService.validatePasswordResetToken(null);

        // Assert
        assertFalse(verificationResult);
        assertFalse(resetResult);
    }
}
