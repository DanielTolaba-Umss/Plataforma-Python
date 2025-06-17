package com.coders.backers.plataformapython.backend.seeders;

import com.coders.backers.plataformapython.backend.models.userModel.AdminEntity;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class AuthTestDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminUser();
    }

    private void createAdminUser() {
        // Admin inicial del sistema - REQUERIDO EN TODOS LOS ENTORNOS
        if (!userRepository.existsByEmail("admin@test.com")) {
            AdminEntity admin = new AdminEntity();
            admin.setName("Admin");
            admin.setLastName("Sistema");
            admin.setEmail("admin@test.com");
            admin.setPhone("12345678");
            admin.setPassword(passwordEncoder.encode("123456789")); // Contraseña: 123456789
            admin.setRole("ADMIN");
            admin.setActive(true);
            admin.setEmailVerified(true);
            admin.setSpecialPermits("ALL_PERMISSIONS");
            
            userRepository.save(admin);
            log.info("✅ Admin inicial creado: admin@test.com / 123456789");
            log.info("🛡️ Use el panel de administración para crear otros usuarios");
        } else {
            log.info("ℹ️ Admin ya existe en el sistema");
        }
        
        log.info("👥 Todos los demás usuarios deben crearse a través del panel de administración");
        log.info("🔗 Acceso admin: POST /api/auth/login con admin@test.com / 123456789");
    }
}
