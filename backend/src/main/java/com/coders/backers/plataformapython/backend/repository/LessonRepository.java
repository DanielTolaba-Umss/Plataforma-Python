package com.coders.backers.plataformapython.backend.repository;


import com.coders.backers.plataformapython.backend.models.LessonModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<LessonModel, Long> {
}