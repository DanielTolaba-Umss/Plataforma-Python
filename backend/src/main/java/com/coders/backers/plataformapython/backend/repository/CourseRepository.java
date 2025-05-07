package com.coders.backers.plataformapython.backend.repository;

import com.coders.backers.plataformapython.backend.models.CourseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<CourseModel, Long> {
}