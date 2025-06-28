package com.coders.backers.plataformapython.backend.utils;

import java.util.regex.Pattern;

public class UserValidations {
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{6,}$";
    private static final String PHONE_PATTERN = "^[0-9]{8}$";
    private static final String NAME_PATTERN = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{3,30}(\\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,30})?$";
    private static final String LAST_NAME_PATTERN = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,30}(\\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,30})?$";

    public static class ValidationResult {
        private boolean isValid;
        private String message;

        public ValidationResult(boolean isValid, String message) {
            this.isValid = isValid;
            this.message = message;
        }

        public boolean isValid() {
            return isValid;
        }

        public String getMessage() {
            return message;
        }
    }

    public static ValidationResult validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return new ValidationResult(false, "La contraseña no puede estar vacía");
        }        if (!Pattern.matches(PASSWORD_PATTERN, password)) {
            return new ValidationResult(false,
                    "La contraseña debe contener al menos 6 caracteres, " +
                            "una mayúscula, una minúscula y un número");
        }

        return new ValidationResult(true, "Contraseña válida");
    }

    public static ValidationResult validatePhone(String phone) {
        if (phone == null || phone.isEmpty()) {
            return new ValidationResult(false, "El número telefónico no puede estar vacío");
        }

        if (!Pattern.matches(PHONE_PATTERN, phone)) {
            return new ValidationResult(false, "El número telefónico debe contener exactamente 8 dígitos");
        }

        return new ValidationResult(true, "Número telefónico válido");
    }

    public static ValidationResult validateName(String name) {
        if (name == null || name.isEmpty()) {
            return new ValidationResult(false, "El nombre no puede estar vacío");
        }
        if (!Pattern.matches(NAME_PATTERN, name)) {
            return new ValidationResult(false,
                    "El nombre debe tener entre 3 y 30 caracteres, puede incluir un segundo nombre de 2 a 30 caracteres, y solo puede contener letras y espacios");
        }

        return new ValidationResult(true, "Nombre válido");
    }

    public static ValidationResult validateLastName(String lastName) {
        if (lastName == null || lastName.isEmpty()) {
            return new ValidationResult(false, "El apellido no puede estar vacío");
        }
        if (!Pattern.matches(LAST_NAME_PATTERN, lastName)) {
            return new ValidationResult(false,
                    "Cada apellido debe tener entre 3 y 30 caracteres, puede incluir un segundo apellido, y solo puede contener letras y espacios");
        }

        return new ValidationResult(true, "Apellido válido");
    }

    public static void validateTeacher(String name, String lastName, String phone, String password) {
        ValidationResult nameValidation = validateName(name);
        if (!nameValidation.isValid()) {
            throw new IllegalArgumentException(nameValidation.getMessage());
        }

        ValidationResult lastNameValidation = validateLastName(lastName);
        if (!lastNameValidation.isValid()) {
            throw new IllegalArgumentException(lastNameValidation.getMessage());
        }

        ValidationResult phoneValidation = validatePhone(phone);
        if (!phoneValidation.isValid()) {
            throw new IllegalArgumentException(phoneValidation.getMessage());
        }

        ValidationResult passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid()) {
            throw new IllegalArgumentException(passwordValidation.getMessage());
        }
    }
}
