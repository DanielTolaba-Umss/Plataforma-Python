package com.coders.backers.plataformapython.backend.controllers.user;

import com.coders.backers.plataformapython.backend.dto.auth.ChangePasswordRequest;
import com.coders.backers.plataformapython.backend.dto.student.StudentCourseDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentLessonDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProfileDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentProgressDto;
import com.coders.backers.plataformapython.backend.dto.student.UpdateStudentProfileDto;
import com.coders.backers.plataformapython.backend.services.auth.AuthService;
import com.coders.backers.plataformapython.backend.services.StudentProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Usuario", description = "Endpoints para gestión de perfil de usuario")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final AuthService authService;
    private final StudentProfileService studentProfileService;

    @Operation(summary = "Cambiar contraseña", description = "Permite al usuario cambiar su propia contraseña")
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {
        log.info("Solicitando cambio de contraseña para usuario: {}", authentication.getName());
        
        try {
            authService.changePassword(authentication.getName(), changePasswordRequest);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Contraseña cambiada exitosamente"
            ));
        } catch (IllegalArgumentException e) {
            log.warn("Error de validación en cambio de contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage(),
                "error", "VALIDATION_ERROR"
            ));
        } catch (BadCredentialsException e) {
            log.warn("Contraseña actual incorrecta para usuario: {}", authentication.getName());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "La contraseña actual es incorrecta",
                "error", "INVALID_CURRENT_PASSWORD"
            ));
        } catch (Exception e) {
            log.error("Error interno cambiando contraseña: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error interno del servidor",
                "error", "INTERNAL_ERROR"
            ));
        }
    }

    @Operation(summary = "Obtener perfil", description = "Obtiene la información del perfil del usuario autenticado")
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        log.info("Solicitando perfil para usuario: {}", authentication.getName());
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "email", authentication.getName(),
            "authorities", authentication.getAuthorities()
        ));
    }

    // ============ ENDPOINTS PARA PERFIL DE ESTUDIANTE ============    @Operation(summary = "Obtener perfil de estudiante", description = "Obtiene la información del perfil del estudiante")
    @GetMapping("/student-profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentProfileDto> getStudentProfile(Authentication authentication) {
        log.info("Solicitando perfil de estudiante para usuario: {}", authentication.getName());
        
        try {
            StudentProfileDto profile = studentProfileService.getStudentProfile(authentication.getName());
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            log.error("Error obteniendo perfil de estudiante: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }    @Operation(summary = "Actualizar perfil de estudiante", description = "Actualiza la información del perfil del estudiante")
    @PutMapping("/student-profile")
    public ResponseEntity<StudentProfileDto> updateStudentProfile(
            @Valid @RequestBody UpdateStudentProfileDto updateStudentProfileDto,
            Authentication authentication) {
        log.info("Actualizando perfil de estudiante para usuario: {}", authentication.getName());
        
        try {
            StudentProfileDto updatedProfile = studentProfileService.updateStudentProfile(
                authentication.getName(), updateStudentProfileDto);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            log.error("Error actualizando perfil de estudiante: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Obtener cursos del estudiante", description = "Obtiene la lista de cursos del estudiante")
    @GetMapping("/student-courses")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<StudentCourseDto>> getStudentCourses(Authentication authentication) {
        log.info("Solicitando cursos de estudiante para usuario: {}", authentication.getName());
        
        try {
            List<StudentCourseDto> courses = studentProfileService.getStudentCourses(authentication.getName());
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            log.error("Error obteniendo cursos de estudiante: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }    @Operation(summary = "Obtener progreso del estudiante", description = "Obtiene el progreso académico del estudiante")
    @GetMapping("/student-progress")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentProgressDto> getStudentProgress(Authentication authentication) {
        log.info("Solicitando progreso de estudiante para usuario: {}", authentication.getName());
        
        try {
            StudentProgressDto progress = studentProfileService.getStudentProgress(authentication.getName());
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            log.error("Error obteniendo progreso de estudiante: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Obtener lecciones de un curso", description = "Obtiene las lecciones de un curso específico con progreso del estudiante")
    @GetMapping("/student-course-lessons/{courseId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<StudentLessonDto>> getStudentCourseLessons(
            @PathVariable Long courseId,
            Authentication authentication) {
        log.info("Solicitando lecciones del curso {} para usuario: {}", courseId, authentication.getName());
        
        try {
            List<StudentLessonDto> lessons = studentProfileService.getStudentCourseLessons(authentication.getName(), courseId);
            return ResponseEntity.ok(lessons);
        } catch (RuntimeException e) {
            log.error("Error obteniendo lecciones del curso: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Iniciar lección", description = "Marca una lección como iniciada (cambia estado a IN_PROGRESS)")
    @PostMapping("/lessons/{lessonId}/start")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> startLesson(
            @PathVariable Long lessonId,
            Authentication authentication) {
        log.info("Iniciando lección {} para usuario: {}", lessonId, authentication.getName());
        
        try {
            boolean started = studentProfileService.startLesson(authentication.getName(), lessonId);
            if (started) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Lección iniciada exitosamente",
                    "status", "IN_PROGRESS"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "No se pudo iniciar la lección"
                ));
            }
        } catch (RuntimeException e) {
            log.error("Error iniciando lección: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @Operation(summary = "Completar lección por práctica", description = "Marca una lección como completada cuando pasa los test cases")
    @PostMapping("/lessons/{lessonId}/complete-practice")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> completeLessonByPractice(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        log.info("Completando lección {} por práctica para usuario: {}", lessonId, authentication.getName());
        
        try {
            Boolean passed = (Boolean) request.get("passed");
            Integer score = (Integer) request.get("score");
            
            if (passed == null || !passed) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "La práctica debe estar aprobada para completar la lección"
                ));
            }
            
            boolean completed = studentProfileService.completeLessonByPractice(authentication.getName(), lessonId, score != null ? score : 100);
            
            if (completed) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Lección completada exitosamente",
                    "status", "COMPLETED"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "No se pudo completar la lección"
                ));
            }
        } catch (RuntimeException e) {
            log.error("Error completando lección: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
