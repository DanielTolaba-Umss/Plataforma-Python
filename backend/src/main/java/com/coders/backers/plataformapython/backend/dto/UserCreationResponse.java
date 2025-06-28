package com.coders.backers.plataformapython.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationResponse {
    
    // Datos del usuario creado
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String userType;
    
    // Datos de inscripción (si aplica)
    private Long enrollmentId;
    private Long courseId;
    private String courseName;
    private String courseLevel;
    private Long startingLessonId;
    private String startingLessonTitle;
    
    // Estado de la operación
    private boolean success;
    private String message;
    
    // Constructor para respuesta exitosa con inscripción (estudiante)
    public UserCreationResponse(Long userId, String username, String email, String firstName, String lastName,
                              Long enrollmentId, Long courseId, String courseName, String courseLevel,
                              Long startingLessonId, String startingLessonTitle) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = "STUDENT";
        this.enrollmentId = enrollmentId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseLevel = courseLevel;
        this.startingLessonId = startingLessonId;
        this.startingLessonTitle = startingLessonTitle;
        this.success = true;
        this.message = "Usuario estudiante creado e inscrito exitosamente";
    }
    
    // Constructor para respuesta exitosa sin inscripción (profesor)
    public UserCreationResponse(Long userId, String username, String email, String firstName, String lastName, String userType) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = userType;
        this.success = true;
        this.message = "Usuario " + userType.toLowerCase() + " creado exitosamente";
    }
    
    // Constructor para respuesta de error
    public UserCreationResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    // Método estático para crear respuesta de error
    public static UserCreationResponse error(String message) {
        return new UserCreationResponse(false, message);
    }
    
    // Método estático para crear respuesta exitosa simple
    public static UserCreationResponse success(String message) {
        return new UserCreationResponse(true, message);
    }
}
