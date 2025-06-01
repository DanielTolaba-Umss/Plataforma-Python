package com.coders.backers.plataformapython.backend.seeders;

import com.coders.backers.plataformapython.backend.models.ResourceTypeModel;
import com.coders.backers.plataformapython.backend.repository.ResourceTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ResourceTypeSeeder implements CommandLineRunner {

    private final ResourceTypeRepository repository;

    public ResourceTypeSeeder(ResourceTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new ResourceTypeModel(1L, "txt", "texto", true));
            repository.save(new ResourceTypeModel(2L, "pdf", "pdf", true));
            repository.save(new ResourceTypeModel(3L, "mp4", "video", true));
            System.out.println("✔ Tipos de recurso cargados correctamente.");
        }
    }
}
