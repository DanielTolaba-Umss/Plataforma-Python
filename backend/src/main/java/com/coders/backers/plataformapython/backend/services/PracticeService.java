package com.coders.backers.plataformapython.backend.services;

import java.util.List;
import com.coders.backers.plataformapython.backend.dto.practice.*;

public interface PracticeService {
    PracticeDto createPractice(CreatePracticeDto dto);

    List<PracticeDto> getAllPractice();

    void deletePractice(Long id);

    PracticeDto updatePractice(Long id, UpdatePracticeDto dto);

    PracticeDto getPracticeById(Long id);

    PracticeDto getPracticeByLessonId(Long lessonId);

}
