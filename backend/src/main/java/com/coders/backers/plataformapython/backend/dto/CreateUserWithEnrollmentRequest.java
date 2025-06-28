package com.coders.backers.plataformapython.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserWithEnrollmentRequest {
      // Datos del usuario
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String userType; // "STUDENT" o "TEACHER"
    
    // Campos específicos para profesores (opcionales)
    private String phone;
    private String specialty;
    
    // Datos de inscripción (opcional para profesores)
    private Long courseId;
    private Long startingLessonId; // Lección inicial para el estudiante (opcional)
    
    // Validaciones
    public boolean isValid() {
        return username != null && !username.trim().isEmpty() &&
               email != null && !email.trim().isEmpty() &&
               password != null && !password.trim().isEmpty() &&
               firstName != null && !firstName.trim().isEmpty() &&
               lastName != null && !lastName.trim().isEmpty() &&
               userType != null && (userType.equals("STUDENT") || userType.equals("TEACHER"));
    }
    
    public boolean isStudent() {
        return "STUDENT".equals(userType);
    }
    
    public boolean isTeacher() {
        return "TEACHER".equals(userType);
    }
}
