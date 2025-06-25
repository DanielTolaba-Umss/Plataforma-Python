package com.coders.backers.plataformapython.backend.utils;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserValidationsTest {
    @Test
    void validateSingleNameTest() {
        UserValidations.ValidationResult result = UserValidations.validateName("Juan");
        assertTrue(result.isValid());
    }

    @Test
    void validateCompoundNameTest() {
        UserValidations.ValidationResult result = UserValidations.validateName("Juan Carlos");
        assertTrue(result.isValid());
    }

    @Test
    void validateShortNameTest() {
        UserValidations.ValidationResult result = UserValidations.validateName("Jo");
        assertFalse(result.isValid());
    }

    @Test
    void validateNameWithNumbersTest() {
        UserValidations.ValidationResult result = UserValidations.validateName("Juan123");
        assertFalse(result.isValid());
    }

    @Test
    void validateNameWithSpecialCharsTest() {
        UserValidations.ValidationResult result = UserValidations.validateName("Juan@");
        assertFalse(result.isValid());
    }

    @Test
    void validateSingleLastNameTest() {
        UserValidations.ValidationResult result = UserValidations.validateLastName("García");
        assertTrue(result.isValid());
    }

    @Test
    void validateCompoundLastNameTest() {
        UserValidations.ValidationResult result = UserValidations.validateLastName("García López");
        assertTrue(result.isValid());
    }

    @Test
    void validateShortLastNameTest() {
        UserValidations.ValidationResult result = UserValidations.validateLastName("Li");
        assertFalse(result.isValid());
    }    @Test
    void validatePasswordTest() {
        UserValidations.ValidationResult result = UserValidations.validatePassword("Password123");
        assertTrue(result.isValid());
    }@Test
    void validatePasswordNoSpecialTest() {
        // Actualizado: Ya no requerimos caracteres especiales
        UserValidations.ValidationResult result = UserValidations.validatePassword("Password123");
        assertTrue(result.isValid());
    }

    @Test
    void validatePasswordNoNumberTest() {
        UserValidations.ValidationResult result = UserValidations.validatePassword("Password@");
        assertFalse(result.isValid());
    }

    @Test
    void validatePhoneTest() {
        UserValidations.ValidationResult result = UserValidations.validatePhone("12345678");
        assertTrue(result.isValid());
    }

    @Test
    void validateShortPhoneTest() {
        UserValidations.ValidationResult result = UserValidations.validatePhone("1234567");
        assertFalse(result.isValid());
    }

    @Test
    void validatePhoneWithLettersTest() {
        UserValidations.ValidationResult result = UserValidations.validatePhone("1234567a");
        assertFalse(result.isValid());
    }    @Test
    void validateTeacherTest() {
        assertDoesNotThrow(() -> {
            UserValidations.validateTeacher("Juan", "García", "12345678", "Password123");
        });
    }

    @Test
    void validateInvalidTeacherTest() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            UserValidations.validateTeacher("J", "García", "12345678", "Password123");
        });
        assertTrue(exception.getMessage().contains("nombre"));
    }
}
