package com.coders.backers.plataformapython.backend.seeders;

import com.coders.backers.plataformapython.backend.models.ContenidoModel;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.repository.ContenidoRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(3)
@RequiredArgsConstructor
@Slf4j
public class ContenidoSeeder implements CommandLineRunner {

    private final ContenidoRepository contenidoRepository;
    private final LessonRepository lessonRepository;

    @Override
    public void run(String... args) throws Exception {
        createContenidoForLessons();
    }

    private void createContenidoForLessons() {
        List<LessonEntity> lecciones = lessonRepository.findAll();
        
        for (LessonEntity leccion : lecciones) {
            // Verificar si ya existe contenido para esta lección usando el repository
            List<ContenidoModel> existingContenido = contenidoRepository.findByLeccion(leccion);
            
            if (existingContenido.isEmpty()) {
                ContenidoModel contenido = new ContenidoModel();
                contenido.setLeccion(leccion);
                contenido.setActive(true);
                contenido.setCreationDate(LocalDateTime.now());
                contenido.setUpdateDate(LocalDateTime.now());
                
                contenidoRepository.save(contenido);
                log.info("✅ Contenido creado para lección: {}", leccion.getTitle());
            }
        }
        
        log.info("🎯 Seeder de contenido completado");
    }
}
