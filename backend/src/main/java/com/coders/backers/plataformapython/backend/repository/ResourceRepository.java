package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.ResourceModel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<ResourceModel, Long> {
    // List<ResourceModel> findByLesson_LessonId(Long leccion_id);
    List<ResourceModel> findByContent_Id(Long lessonId);


}
