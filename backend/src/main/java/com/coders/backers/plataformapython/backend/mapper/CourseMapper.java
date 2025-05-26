package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.models.CourseEntity;

public class CourseMapper {

    public static CourseDto mapToModelDto(CourseEntity course) {
        return new CourseDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getLevel(),
                course.getOrden(),
                course.getCreatedAt(),
                course.getUpdatedAt(),
                course.isActive()
        );
    }

    public static CourseEntity mapToModel(CourseDto courseDto) {
        return new CourseEntity(
                courseDto.getId(),
                courseDto.getTitle(),
                courseDto.getDescription(),
                courseDto.getLevel(),
                courseDto.getOrden(),
                courseDto.getCreatedAt(),
                courseDto.getUpdatedAt(),
                courseDto.isActive()
        );
    }
    
    public static CourseEntity mapFromCreateDto(CreateCourseDto createDto) {
        return new CourseEntity(
                createDto.getTitle(),
                createDto.getDescription(),
                createDto.getLevel(),
                createDto.getOrden()
        );
    }
}