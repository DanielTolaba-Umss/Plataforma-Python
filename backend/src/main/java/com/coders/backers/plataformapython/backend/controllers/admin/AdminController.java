package com.coders.backers.plataformapython.backend.controllers.admin;

import com.coders.backers.plataformapython.backend.dto.admin.CreateUserRequest;
import com.coders.backers.plataformapython.backend.dto.admin.UpdateUserRequest;
import com.coders.backers.plataformapython.backend.dto.admin.UserResponse;
import com.coders.backers.plataformapython.backend.dto.CreateUserWithEnrollmentRequest;
import com.coders.backers.plataformapython.backend.dto.UserCreationResponse;
import com.coders.backers.plataformapython.backend.services.admin.UserManagementService;
import com.coders.backers.plataformapython.backend.services.AdminUserCreationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin", description = "Endpoints para administración de usuarios")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final UserManagementService userManagementService;
    private final AdminUserCreationService adminUserCreationService;

    @PostMapping("/users")
    @Operation(summary = "Crear nuevo usuario", description = "Permite al admin crear un nuevo usuario en el sistema")
    @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @ApiResponse(responseCode = "409", description = "El email ya existe")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("Admin creando nuevo usuario con email: {}", request.getEmail());
        
        try {
            UserResponse user = userManagementService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            log.error("Error al crear usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();        }
    }    @GetMapping("/users")
    @Operation(summary = "Obtener usuarios con paginación", description = "Obtiene lista paginada de usuarios con filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
            @Parameter(description = "Filtrar por nombre") @RequestParam(required = false) String name,
            @Parameter(description = "Filtrar por email") @RequestParam(required = false) String email,
            @Parameter(description = "Filtrar por rol") @RequestParam(required = false) String role,
            @Parameter(description = "Filtrar por estado activo") @RequestParam(required = false) Boolean active) {
        
        log.info("Admin obteniendo usuarios - page: {}, size: {}, name: {}, email: {}, role: {}, active: {}", 
                pageable.getPageNumber(), pageable.getPageSize(), name, email, role, active);
        
        Page<UserResponse> users = userManagementService.getUsers(pageable, name, email, role, active);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene los detalles de un usuario específico")
    @ApiResponse(responseCode = "200", description = "Usuario encontrado")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        log.info("Admin obteniendo usuario con ID: {}", id);
        
        try {
            UserResponse user = userManagementService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Usuario no encontrado con ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        
        log.info("Admin actualizando usuario con ID: {}", id);
        
        try {
            UserResponse user = userManagementService.updateUser(id, request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error al actualizar usuario con ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }    @DeleteMapping("/users/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina permanentemente un usuario del sistema")
    @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Admin eliminando usuario con ID: {}", id);
        
        try {
            userManagementService.deleteUser(id);            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error al eliminar usuario con ID {}: {}", id, e.getMessage(), e);
            
            // Verificar si el error es específicamente porque el usuario no existe
            if (e.getMessage() != null && e.getMessage().contains("Usuario no encontrado")) {
                return ResponseEntity.notFound().build();
            }
            
            // Para otros errores, devolver error 500 con más información
            log.error("Error inesperado al eliminar usuario ID {}: {}", id, e.getClass().getSimpleName());
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/users/{id}/activate")
    @Operation(summary = "Activar usuario", description = "Activa un usuario desactivado")
    @ApiResponse(responseCode = "200", description = "Usuario activado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long id) {
        log.info("Admin activando usuario con ID: {}", id);
        
        try {
            UserResponse user = userManagementService.activateUser(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error al activar usuario con ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/users/{id}/deactivate")
    @Operation(summary = "Desactivar usuario", description = "Desactiva un usuario activo")
    @ApiResponse(responseCode = "200", description = "Usuario desactivado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable Long id) {
        log.info("Admin desactivando usuario con ID: {}", id);
        
        try {
            UserResponse user = userManagementService.deactivateUser(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error al desactivar usuario con ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/role/{role}")
    @Operation(summary = "Obtener usuarios por rol", description = "Obtiene todos los usuarios de un rol específico")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios por rol obtenida exitosamente")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        log.info("Admin obteniendo usuarios por rol: {}", role);
        
        List<UserResponse> users = userManagementService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/active")
    @Operation(summary = "Obtener usuarios activos", description = "Obtiene todos los usuarios activos del sistema")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios activos obtenida exitosamente")
    public ResponseEntity<List<UserResponse>> getActiveUsers() {
        log.info("Admin obteniendo usuarios activos");
        
        List<UserResponse> users = userManagementService.getActiveUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats")
    @Operation(summary = "Obtener estadísticas de usuarios", description = "Obtiene estadísticas generales del sistema")
    @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas exitosamente")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        log.info("Admin obteniendo estadísticas de usuarios");
        
        Map<String, Object> stats = userManagementService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/users/{id}/verify-email")
    @Operation(summary = "Verificar email manualmente", description = "Permite al admin verificar manualmente el email de un usuario")
    @ApiResponse(responseCode = "200", description = "Email verificado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UserResponse> verifyUserEmail(@PathVariable Long id) {
        log.info("Admin verificando email para usuario con ID: {}", id);
        
        try {
            UserResponse user = userManagementService.verifyUserEmail(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error al verificar email para usuario con ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }    @PatchMapping("/users/{id}/reset-password")
    @Operation(summary = "Resetear contraseña", description = "Permite al admin resetear la contraseña de un usuario")
    @ApiResponse(responseCode = "200", description = "Contraseña reseteada exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<UserResponse> resetUserPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        log.info("Admin reseteando contraseña para usuario con ID: {}", id);
        
        try {
            UserResponse user = userManagementService.resetUserPassword(id, newPassword);
            return ResponseEntity.ok(user);        } catch (RuntimeException e) {
            log.error("Error al resetear contraseña para usuario con ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    //Comentario de apoyo
    @PostMapping("/users/create-with-enrollment")
    @Operation(summary = "Crear usuario con inscripción/asignación", 
               description = "Endpoint unificado para crear estudiantes con inscripción automática o profesores con asignación de curso")
    @ApiResponse(responseCode = "201", description = "Usuario creado e inscrito/asignado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @ApiResponse(responseCode = "409", description = "El usuario ya existe")
    public ResponseEntity<UserCreationResponse> createUserWithEnrollment(@Valid @RequestBody CreateUserWithEnrollmentRequest request) {
        log.info("Admin creando usuario con inscripción/asignación: {} - Tipo: {}", request.getUsername(), request.getUserType());
        
        UserCreationResponse response = adminUserCreationService.createUserWithEnrollment(request);
          if (response.isSuccess()) {            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
