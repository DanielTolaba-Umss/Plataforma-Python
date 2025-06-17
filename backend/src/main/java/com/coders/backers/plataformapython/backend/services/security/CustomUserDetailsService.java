package com.coders.backers.plataformapython.backend.services.security;

import com.coders.backers.plataformapython.backend.models.userModel.UserEntity;
import com.coders.backers.plataformapython.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con email: " + email));

        // Verificar que el usuario esté activo
        if (!user.isActive()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + email);
        }        // Verificar que el email esté verificado (temporalmente comentado para testing)
        // if (!user.isEmailVerified()) {
        //     throw new UsernameNotFoundException("Email no verificado: " + email);
        // }

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(getAuthorities(user))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }

    /**
     * Convierte el rol del usuario en autoridades de Spring Security
     */
    private Collection<? extends GrantedAuthority> getAuthorities(UserEntity user) {
        // Spring Security requiere el prefijo "ROLE_" para los roles
        String roleName = "ROLE_" + user.getRole();
        return Collections.singleton(new SimpleGrantedAuthority(roleName));
    }
}
