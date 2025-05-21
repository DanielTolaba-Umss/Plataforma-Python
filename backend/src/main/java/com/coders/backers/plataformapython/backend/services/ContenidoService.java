package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.content.ContenidoDto;

import java.util.List;

public interface ContenidoService {
    ContenidoDto getById(Long id);
    List<ContenidoDto> getAll();
    ContenidoDto create(ContenidoDto dto);
    ContenidoDto update(Long id, ContenidoDto dto);
    void delete(Long id);
}
