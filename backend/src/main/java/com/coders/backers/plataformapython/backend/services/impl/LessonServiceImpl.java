package com.coders.backers.plataformapython.backend.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coders.backers.plataformapython.backend.dto.lesson.CreateLessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.dto.lesson.UpdateLessonDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.LessonMapper;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.services.LessonService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class LessonServiceImpl implements LessonService {

    private LessonRepository lessonRepository;
    private CourseRepository courseRepository;

    @Override
    public LessonDto createLesson(CreateLessonDto createLessonDto) {
        CourseEntity courseEntity = courseRepository.findById(createLessonDto.getCourseId())
            .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + createLessonDto.getCourseId()));
        
        LessonEntity lessonEntity = LessonMapper.mapFromCreateDto(createLessonDto, courseEntity);
        LessonEntity savedLesson = lessonRepository.save(lessonEntity);
        return LessonMapper.mapToModelDto(savedLesson);
    }

    @Override
    public LessonDto getLessonById(Long id) {
        LessonEntity lessonEntity = lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + id));
        return LessonMapper.mapToModelDto(lessonEntity);
    }
    
    @Override
    public List<LessonDto> getAllLessons() {
        List<LessonEntity> lessons = lessonRepository.findAll();
        return lessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LessonDto> getActiveLessons() {
        List<LessonEntity> activeLessons = lessonRepository.findByActive(true);
        return activeLessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LessonDto> getLessonsByCourseId(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Curso no encontrado con id: " + courseId);
        }
        
        List<LessonEntity> lessons = lessonRepository.findByCourseId(courseId);
        return lessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LessonDto> getActiveLessonsByCourseId(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Curso no encontrado con id: " + courseId);
        }
        
        List<LessonEntity> activeLessons = lessonRepository.findByCourseIdAndActive(courseId, true);
        return activeLessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LessonDto> getLessonsByCourseIdAndLevel(Long courseId, String level) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Curso no encontrado con id: " + courseId);
        }
        
        List<LessonEntity> lessons = lessonRepository.findByCourseIdAndCourseLevel(courseId, level);
        return lessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LessonDto> getActiveLessonsByCourseIdAndLevel(Long courseId, String level) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Curso no encontrado con id: " + courseId);
        }
        
        List<LessonEntity> activeLessons = lessonRepository.findByCourseIdAndCourseLevelAndActive(courseId, level, true);
        return activeLessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public LessonDto updateLesson(Long id, UpdateLessonDto updateLessonDto) {        LessonEntity lessonEntity = lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + id));
        
        lessonEntity.setTitle(updateLessonDto.getTitle());
        lessonEntity.setDescription(updateLessonDto.getDescription());
        
        // TODO: Implementar actualización de Quiz y Practice a través de relaciones JPA
        // cuando sea necesario. Por ahora, las relaciones se manejan a través de ContenidoModel
        
        // Actualizar el curso si ha cambiado
        if (updateLessonDto.getCourseId() != null && 
            (lessonEntity.getCourse() == null || !updateLessonDto.getCourseId().equals(lessonEntity.getCourse().getId()))) {
            CourseEntity courseEntity = courseRepository.findById(updateLessonDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + updateLessonDto.getCourseId()));
            lessonEntity.setCourse(courseEntity);
        }

        LessonEntity updatedLesson = lessonRepository.save(lessonEntity);
        return LessonMapper.mapToModelDto(updatedLesson);
    }
    
    @Override
    public LessonDto activateLesson(Long id) {
        LessonEntity lessonEntity = lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + id));
            
        lessonEntity.setActive(true);
        LessonEntity updatedLesson = lessonRepository.save(lessonEntity);
        return LessonMapper.mapToModelDto(updatedLesson);
    }
    
    @Override
    public LessonDto deactivateLesson(Long id) {
        LessonEntity lessonEntity = lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + id));
            
        lessonEntity.setActive(false);
        LessonEntity updatedLesson = lessonRepository.save(lessonEntity);
        return LessonMapper.mapToModelDto(updatedLesson);
    }
    
    @Override
    public void deleteLesson(Long id) {
        LessonEntity lessonEntity = lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lección no encontrada con id: " + id));
            
        lessonRepository.delete(lessonEntity);
    }
    
    @Override
    public List<LessonDto> searchLessonsByTitle(String title) {
        List<LessonEntity> lessons = lessonRepository.findByTitleContainingIgnoreCase(title);
        return lessons.stream()
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
}