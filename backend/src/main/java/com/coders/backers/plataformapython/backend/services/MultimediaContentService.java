package com.coders.backers.plataformapython.backend.service;

import com.coders.backers.plataformapython.backend.dto.MultimediaContentDTO;

import java.util.List;

public interface MultimediaContentService {
    MultimediaContentDTO getById(Long id);
    List<MultimediaContentDTO> getAll();
    MultimediaContentDTO create(MultimediaContentDTO dto);
    MultimediaContentDTO update(Long id, MultimediaContentDTO dto);
    void delete(Long id);
}
