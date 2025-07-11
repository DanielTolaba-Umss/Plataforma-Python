package com.coders.backers.plataformapython.backend.services.admin.impl;

import com.coders.backers.plataformapython.backend.dto.admin.CreateUserRequest;
import com.coders.backers.plataformapython.backend.dto.admin.UpdateUserRequest;
import com.coders.backers.plataformapython.backend.dto.admin.UserResponse;
import com.coders.backers.plataformapython.backend.enums.Role;
import com.coders.backers.plataformapython.backend.models.userModel.*;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.services.admin.UserManagementService;
import com.coders.backers.plataformapython.backend.services.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserManagementServiceImpl implements UserManagementService {    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creando nuevo usuario con email: {}", request.getEmail());
        
        // Verificar que el email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + request.getEmail());
        }
        
        // Crear la entidad según el rol
        UserEntity user = createUserEntityByRole(request);
          // Configurar campos comunes
        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().name());
        user.setActive(request.isActive());
        // Las cuentas creadas por admin siempre están verificadas
        user.setEmailVerified(true);
        user.setCreatedAt(Date.valueOf(LocalDate.now()));
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
          // Configurar campos específicos por rol
        configureRoleSpecificFields(user, request);
          UserEntity savedUser = userRepository.save(user);
        log.info("Usuario creado exitosamente con ID: {}", savedUser.getId());
        
        // Enviar email de bienvenida con credenciales
        try {
            emailService.sendWelcomeEmailWithCredentials(savedUser, request.getPassword());
            log.info("Email de bienvenida con credenciales enviado a: {}", savedUser.getEmail());
        } catch (Exception e) {
            log.warn("Error enviando email de bienvenida a {}: {}", savedUser.getEmail(), e.getMessage());
            // No interrumpir el flujo si falla el envío de email
        }
        
        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(this::mapToUserResponse);
    }    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRole(role.name())
            .stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsersByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email)
            .stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name)
            .stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Actualizando usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        // Actualizar campos si están presentes
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            if (!request.getEmail().equals(user.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Ya existe un usuario con el email: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        boolean passwordChanged = false;
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            passwordChanged = true;
        }
        
        if (request.getEmailVerified() != null) {
            user.setEmailVerified(request.getEmailVerified());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
          // Actualizar campos específicos por rol
        updateRoleSpecificFields(user, request);
        
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        
        UserEntity updatedUser = userRepository.save(user);
        log.info("Usuario actualizado exitosamente");
        
        // Enviar notificación si se cambió la contraseña
        if (passwordChanged) {
            try {
                emailService.sendPasswordChangeNotification(updatedUser);
                log.info("Notificación de cambio de contraseña enviada a: {}", updatedUser.getEmail());
            } catch (Exception e) {
                log.warn("Error enviando notificación de cambio de contraseña a {}: {}", updatedUser.getEmail(), e.getMessage());
                // No interrumpir el flujo si falla el envío de email
            }
        }
        
        return mapToUserResponse(updatedUser);
    }

    @Override
    public UserResponse activateUser(Long id) {
        log.info("Activando usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
          user.setActive(true);
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        
        UserEntity activatedUser = userRepository.save(user);
        log.info("Usuario activado exitosamente");
        
        return mapToUserResponse(activatedUser);
    }

    @Override
    public UserResponse deactivateUser(Long id) {
        log.info("Desactivando usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
          user.setActive(false);
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        
        UserEntity deactivatedUser = userRepository.save(user);
        log.info("Usuario desactivado exitosamente");
        
        return mapToUserResponse(deactivatedUser);
    }

    @Override
    public UserResponse verifyUserEmail(Long id) {
        log.info("Verificando email de usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
          user.setEmailVerified(true);
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        
        UserEntity verifiedUser = userRepository.save(user);
        log.info("Email de usuario verificado exitosamente");
        
        return mapToUserResponse(verifiedUser);
    }    @Override
    public UserResponse changeUserPassword(Long id, String newPassword) {
        log.info("Cambiando contraseña de usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
          user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        
        UserEntity updatedUser = userRepository.save(user);
        log.info("Contraseña cambiada exitosamente");
        
        // Enviar notificación de cambio de contraseña
        try {
            emailService.sendPasswordChangeNotification(updatedUser);
            log.info("Notificación de cambio de contraseña enviada a: {}", updatedUser.getEmail());
        } catch (Exception e) {
            log.warn("Error enviando notificación de cambio de contraseña a {}: {}", updatedUser.getEmail(), e.getMessage());
            // No interrumpir el flujo si falla el envío de email
        }
        
        return mapToUserResponse(updatedUser);
    }    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        try {            // Si es un estudiante, necesitamos limpiar las relaciones en el orden correcto
            if ("STUDENT".equals(user.getRole())) {
                log.info("Limpiando relaciones para estudiante ID: {}", id);
                  try {
                    // 1. Primero eliminar progreso de lecciones (que depende de inscripciones)
                    log.info("Paso 1: Eliminando progreso de lecciones para estudiante ID: {}", id);
                    int deletedProgressRows = userRepository.deleteStudentLessonProgressByUserId(id);
                    log.info("Paso 1 completado exitosamente - {} registros eliminados de student_lesson_progress", deletedProgressRows);
                    
                    // 2. Luego eliminar inscripciones a cursos
                    log.info("Paso 2: Eliminando inscripciones a cursos para estudiante ID: {}", id);
                    int deletedEnrollmentRows = userRepository.deleteStudentCourseEnrollmentsByUserId(id);
                    log.info("Paso 2 completado exitosamente - {} registros eliminados de student_course_enrollment", deletedEnrollmentRows);
                    
                    // 3. Finalmente eliminar relaciones de la tabla student_course
                    log.info("Paso 3: Eliminando relaciones de cursos para estudiante ID: {}", id);
                    int deletedCourseRows = userRepository.deleteStudentCourseRelations(id);
                    log.info("Paso 3 completado exitosamente - {} registros eliminados de student_course", deletedCourseRows);
                    
                } catch (Exception e) {
                    log.error("Error en limpieza de relaciones para estudiante ID {}: {}", id, e.getMessage(), e);
                    throw e;
                }
            }
              // Si es un profesor, limpiar otras relaciones si las hay
            if ("TEACHER".equals(user.getRole())) {
                log.info("Limpiando relaciones para profesor ID: {}", id);
                try {
                    // Eliminar relaciones de la tabla teacher_course
                    log.info("Eliminando relaciones de cursos para profesor ID: {}", id);
                    int deletedTeacherCourseRows = userRepository.deleteTeacherCourseRelations(id);
                    log.info("Relaciones de cursos eliminadas exitosamente - {} registros eliminados de teacher_course", deletedTeacherCourseRows);
                    
                } catch (Exception e) {
                    log.error("Error en limpieza de relaciones para profesor ID {}: {}", id, e.getMessage(), e);
                    throw e;
                }
            }
            
            // Ahora eliminar el usuario
            log.info("Eliminando usuario de la tabla principal");
            userRepository.delete(user);
            log.info("Usuario eliminado exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            log.error("Error al eliminar usuario ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error al eliminar usuario: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatistics getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActive(true);
        long inactiveUsers = userRepository.countByActive(false);
        long admins = userRepository.countByRole("ADMIN");
        long teachers = userRepository.countByRole("TEACHER");
        long students = userRepository.countByRole("STUDENT");
        long verifiedEmails = userRepository.countByEmailVerified(true);
        long unverifiedEmails = userRepository.countByEmailVerified(false);
        
        return new UserStatistics(
            totalUsers, activeUsers, inactiveUsers,
            admins, teachers, students,
            verifiedEmails, unverifiedEmails
        );
    }

    // Métodos auxiliares
    private UserEntity createUserEntityByRole(CreateUserRequest request) {
        return switch (request.getRole()) {
            case ADMIN -> new AdminEntity();
            case TEACHER -> new TeacherEntity();
            case STUDENT -> new StudentEntity();
        };
    }

    private void configureRoleSpecificFields(UserEntity user, CreateUserRequest request) {
        switch (request.getRole()) {
            case ADMIN -> {
                AdminEntity admin = (AdminEntity) user;
                admin.setSpecialPermits(request.getSpecialPermits());
            }
            case TEACHER -> {
                TeacherEntity teacher = (TeacherEntity) user;
                teacher.setSpecialty(request.getSpecialty());
            }
            case STUDENT -> {
                // StudentEntity no tiene campos específicos adicionales
            }
        }
    }

    private void updateRoleSpecificFields(UserEntity user, UpdateUserRequest request) {
        if (user instanceof AdminEntity admin && request.getSpecialPermits() != null) {
            admin.setSpecialPermits(request.getSpecialPermits());
        }
        if (user instanceof TeacherEntity teacher && request.getSpecialty() != null) {
            teacher.setSpecialty(request.getSpecialty());
        }
    }    private UserResponse mapToUserResponse(UserEntity user) {
        UserResponse.UserResponseBuilder builder = UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(Role.valueOf(user.getRole()))
            .active(user.isActive())
            .emailVerified(user.isEmailVerified())
            .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate().atStartOfDay() : null)
            .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toLocalDate().atStartOfDay() : null);

        // Agregar campos específicos por rol
        if (user instanceof AdminEntity admin) {
            builder.specialPermits(admin.getSpecialPermits());
        } else if (user instanceof TeacherEntity teacher) {
            builder.specialty(teacher.getSpecialty());
        }        return builder.build();
    }
    
    // Métodos adicionales requeridos por AdminController
      @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(Pageable pageable, String name, String email, String role, Boolean active) {
        log.info("Obteniendo usuarios con filtros - name: {}, email: {}, role: {}, active: {}", name, email, role, active);
        
        return userRepository.findByFilters(name, email, role, active, pageable)
            .map(this::mapToUserResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(String role) {
        log.info("Obteniendo usuarios por rol: {}", role);
        
        return userRepository.findByRole(role)
            .stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getActiveUsers() {
        log.info("Obteniendo usuarios activos");
        
        return userRepository.findByActive(true)
            .stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
    }
      @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStats() {
        log.info("Obteniendo estadísticas generales de usuarios");
        
        Map<String, Object> stats = new HashMap<>();
        
        // Estadísticas básicas
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByActive(true));
        stats.put("inactiveUsers", userRepository.countByActive(false));
        
        // Estadísticas por rol
        stats.put("admins", userRepository.countByRole("ADMIN"));
        stats.put("teachers", userRepository.countByRole("TEACHER"));
        stats.put("students", userRepository.countByRole("STUDENT"));
        
        // Estadísticas de verificación
        stats.put("verifiedEmails", userRepository.countByEmailVerified(true));
        stats.put("unverifiedEmails", userRepository.countByEmailVerified(false));
        
        // Estadísticas de cursos
        stats.put("totalCourses", courseRepository.count());
        
        return stats;
    }
      @Override
    public UserResponse resetUserPassword(Long id, String newPassword) {
        log.info("Admin reseteando contraseña para usuario con ID: {}", id);
        
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Date.valueOf(LocalDate.now()));
        
        UserEntity updatedUser = userRepository.save(user);
        log.info("Contraseña reseteada exitosamente por admin");
        
        // Enviar notificación de cambio de contraseña por admin
        try {
            emailService.sendPasswordChangeNotification(updatedUser);
            log.info("Notificación de reset de contraseña enviada a: {}", updatedUser.getEmail());
        } catch (Exception e) {
            log.warn("Error enviando notificación de reset de contraseña a {}: {}", updatedUser.getEmail(), e.getMessage());
            // No interrumpir el flujo si falla el envío de email
        }
        
        return mapToUserResponse(updatedUser);
    }
}
