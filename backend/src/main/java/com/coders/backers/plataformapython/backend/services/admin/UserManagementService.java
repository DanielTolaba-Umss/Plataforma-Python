package com.coders.backers.plataformapython.backend.services.admin;

import com.coders.backers.plataformapython.backend.dto.admin.CreateUserRequest;
import com.coders.backers.plataformapython.backend.dto.admin.UpdateUserRequest;
import com.coders.backers.plataformapython.backend.dto.admin.UserResponse;
import com.coders.backers.plataformapython.backend.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserManagementService {
    
    /**
     * Crear un nuevo usuario
     */
    UserResponse createUser(CreateUserRequest request);
    
    /**
     * Obtener usuario por ID
     */
    UserResponse getUserById(Long id);
    
    /**
     * Obtener todos los usuarios con paginación
     */
    Page<UserResponse> getAllUsers(Pageable pageable);
      /**
     * Obtener usuarios por rol
     */
    List<UserResponse> getUsersByRole(Role role);
    
    /**
     * Buscar usuarios por email
     */
    List<UserResponse> searchUsersByEmail(String email);
    
    /**
     * Buscar usuarios por nombre
     */
    List<UserResponse> searchUsersByName(String name);
    
    /**
     * Actualizar usuario
     */
    UserResponse updateUser(Long id, UpdateUserRequest request);
    
    /**
     * Activar usuario
     */
    UserResponse activateUser(Long id);
    
    /**
     * Desactivar usuario
     */
    UserResponse deactivateUser(Long id);
    
    /**
     * Verificar email de usuario
     */
    UserResponse verifyUserEmail(Long id);
    
    /**
     * Cambiar contraseña de usuario
     */
    UserResponse changeUserPassword(Long id, String newPassword);
    
    /**
     * Eliminar usuario (soft delete)
     */
    void deleteUser(Long id);
      /**
     * Obtener estadísticas de usuarios
     */
    UserStatistics getUserStatistics();
      /**
     * Obtener usuarios con paginación y filtros
     */
    Page<UserResponse> getUsers(Pageable pageable, String name, String email, String role, Boolean active);
    
    /**
     * Obtener usuarios por rol (string)
     */
    List<UserResponse> getUsersByRole(String role);
    
    /**
     * Obtener usuarios activos
     */
    List<UserResponse> getActiveUsers();
    
    /**
     * Obtener estadísticas generales
     */
    java.util.Map<String, Object> getUserStats();
    
    /**
     * Resetear contraseña de usuario
     */
    UserResponse resetUserPassword(Long id, String newPassword);
    
    /**
     * Clase para estadísticas
     */
    record UserStatistics(
        long totalUsers,
        long activeUsers,
        long inactiveUsers,
        long admins,
        long teachers,
        long students,
        long verifiedEmails,
        long unverifiedEmails
    ) {}
}
