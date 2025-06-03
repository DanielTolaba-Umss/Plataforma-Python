package com.coders.backers.plataformapython.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    
    // Buscar por email (para login)
    Optional<UserEntity> findByEmail(String email);
    
    // Verificar si existe email (para validaciones)
    boolean existsByEmail(String email);
    
    // Buscar por rol
    List<UserEntity> findByRole(String role);
    
    // Buscar por estado activo
    List<UserEntity> findByActive(boolean active);
    
    // Buscar por email y estado activo
    Optional<UserEntity> findByEmailAndActive(String email, boolean active);
    
    // Buscar por email y email verificado
    Optional<UserEntity> findByEmailAndEmailVerified(String email, boolean emailVerified);
    
    // Métodos para paginación y búsqueda (Admin)
    Page<UserEntity> findByRole(String role, Pageable pageable);
      Page<UserEntity> findByActive(boolean active, Pageable pageable);
      @Query("SELECT u FROM UserEntity u WHERE " +
           "(:name IS NULL OR u.name LIKE %:name%) AND " +
           "(:email IS NULL OR u.email LIKE %:email%) AND " +
           "(:role IS NULL OR u.role = :role)")
    Page<UserEntity> findByFilters(@Param("name") String name, 
                                   @Param("email") String email, 
                                   @Param("role") String role, 
                                   Pageable pageable);
    
    // Contar usuarios por rol
    long countByRole(String role);
    
    // Contar usuarios activos
    long countByActive(boolean active);
      // Contar usuarios con email verificado
    long countByEmailVerified(boolean emailVerified);
    
    // Métodos de búsqueda por texto
    List<UserEntity> findByEmailContainingIgnoreCase(String email);
    
    List<UserEntity> findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String name, String lastName);
}
