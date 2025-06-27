package com.coders.backers.plataformapython.backend.security;

import com.coders.backers.plataformapython.backend.services.security.CustomUserDetailsService;
import com.coders.backers.plataformapython.backend.services.security.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Extraer el header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Verificar si existe el header y tiene el formato correcto
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer el token (sin el "Bearer " prefix)
        jwt = authHeader.substring(7);
        
        try {
            // Extraer el email del token
            userEmail = jwtService.extractUsername(jwt);

            // Si tenemos email y no hay autenticación previa en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Cargar los detalles del usuario
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                log.info("JWT Filter: Usuario cargado: {} con authorities: {}", userEmail, userDetails.getAuthorities());

                // Validar el token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Crear el token de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // Agregar detalles adicionales de la request
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Establecer la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    log.info("JWT Filter: Usuario autenticado: {} con roles: {} para URI: {}", 
                            userEmail, userDetails.getAuthorities(), request.getRequestURI());
                    log.info("JWT Filter: Método HTTP: {}", request.getMethod());
                } else {
                    log.warn("JWT Filter: Token inválido para usuario: {}", userEmail);
                }
            }
        } catch (Exception e) {
            // Log del error pero no interrumpir el flujo
            log.warn("Error procesando JWT: {}", e.getMessage());
            // Limpiar el contexto de seguridad en caso de error
            SecurityContextHolder.clearContext();
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Opcional: skipear el filtro para ciertos paths
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/public/") ||
               path.startsWith("/swagger-ui/") ||
               path.startsWith("/v3/api-docs/");
    }
}
