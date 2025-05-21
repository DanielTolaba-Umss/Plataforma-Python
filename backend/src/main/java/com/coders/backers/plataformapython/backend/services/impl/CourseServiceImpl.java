package com.coders.backers.plataformapython.backend.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.dto.course.UpdateCourseDto;
import com.coders.backers.plataformapython.backend.dto.lesson.LessonDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.CourseMapper;
import com.coders.backers.plataformapython.backend.mapper.LessonMapper;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.services.CourseService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private CourseRepository courseRepository;
    private LessonRepository lessonRepository;

    @Override
    public CourseDto createCourse(CreateCourseDto createCourseDto) {
        CourseEntity courseEntity = CourseMapper.mapFromCreateDto(createCourseDto);
        CourseEntity savedCourse = courseRepository.save(courseEntity);
        return CourseMapper.mapToModelDto(savedCourse);
    }

    @Override
    public CourseDto getCourseById(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
        return CourseMapper.mapToModelDto(courseEntity);
    }
    
    @Override
    public List<CourseDto> getAllCourses() {
        List<CourseEntity> courses = courseRepository.findAll();
        return courses.stream()
            .map(CourseMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<CourseDto> getActiveCourses() {
        List<CourseEntity> activeCourses = courseRepository.findByActive(true);
        return activeCourses.stream()
            .map(CourseMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<CourseDto> getCoursesByLevel(String level) {
        List<CourseEntity> coursesByLevel = courseRepository.findByLevel(level);
        return coursesByLevel.stream()
            .map(CourseMapper::mapToModelDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public CourseDto updateCourse(Long id, UpdateCourseDto updateCourseDto) {
        CourseEntity courseEntity = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
            
        courseEntity.setTitle(updateCourseDto.getTitle());
        courseEntity.setDescription(updateCourseDto.getDescription());
        courseEntity.setLevel(updateCourseDto.getLevel());
        courseEntity.setOrden(updateCourseDto.getOrden());

        CourseEntity updatedCourse = courseRepository.save(courseEntity);
        return CourseMapper.mapToModelDto(updatedCourse);
    }
    
    @Override
    public CourseDto activateCourse(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
            
        courseEntity.setActive(true);
        CourseEntity updatedCourse = courseRepository.save(courseEntity);
        return CourseMapper.mapToModelDto(updatedCourse);
    }
    
    @Override
    public CourseDto deactivateCourse(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
            
        courseEntity.setActive(false);
        CourseEntity updatedCourse = courseRepository.save(courseEntity);
        return CourseMapper.mapToModelDto(updatedCourse);
    }
    
    @Override
    public void deleteCourse(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
            
        courseRepository.delete(courseEntity);
    }
    
    @Override
    public List<CourseDto> searchCoursesByTitle(String title) {
        List<CourseEntity> courses = courseRepository.findByTitleContainingIgnoreCase(title);
        return courses.stream()
            .map(CourseMapper::mapToModelDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<LessonDto> getLessonsByCourseDifficulty(String level, Boolean active) {
        // Primero obtenemos los cursos del nivel especificado
        List<CourseEntity> courses = courseRepository.findByLevel(level);
        
        // Obtenemos todas las lecciones de esos cursos
        List<LessonDto> allLessons = courses.stream()
            .flatMap(course -> {
                List<LessonEntity> lessons;
                if (active != null) {
                    lessons = lessonRepository.findByCourseIdAndActive(course.getId(), active);
                } else {
                    lessons = lessonRepository.findByCourseId(course.getId());
                }
                return lessons.stream();
            })
            .map(LessonMapper::mapToModelDto)
            .collect(Collectors.toList());
        
        return allLessons;
    }
}