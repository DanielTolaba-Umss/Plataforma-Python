package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.lesson.CreateLessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;

public class LessonMapper {

    public static LessonDto mapToModelDto(LessonEntity lesson) {
        return new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.isActive(),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt(),
                lesson.getCourse() != null ? CourseMapper.mapToModelDto(lesson.getCourse()) : null,
                lesson.getQuizId(),
                lesson.getPracticeId()
        );
    }

    public static LessonEntity mapToModel(LessonDto lessonDto, CourseEntity course) {
        return new LessonEntity(
                lessonDto.getId(),
                lessonDto.getTitle(),
                lessonDto.getDescription(),
                lessonDto.isActive(),
                lessonDto.getCreatedAt(),
                lessonDto.getUpdatedAt(),
                course,
                lessonDto.getQuizId(),
                lessonDto.getPracticeId()
        );
    }
    
    public static LessonEntity mapFromCreateDto(CreateLessonDto createDto, CourseEntity course) {
        LessonEntity lesson = new LessonEntity(
                createDto.getTitle(),
                createDto.getDescription(),
                course
        );
        lesson.setQuizId(createDto.getQuizId());
        lesson.setPracticeId(createDto.getPracticeId());
        return lesson;
    }
}