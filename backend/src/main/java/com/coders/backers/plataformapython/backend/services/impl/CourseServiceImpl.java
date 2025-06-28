package com.coders.backers.plataformapython.backend.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import com.coders.backers.plataformapython.backend.dto.course.CreateCourseDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.dto.course.UpdateCourseDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.exception.ResourceNotFoundException;
import com.coders.backers.plataformapython.backend.mapper.CourseMapper;
import com.coders.backers.plataformapython.backend.mapper.StudentMapper;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.repository.TeacherRepository;
import com.coders.backers.plataformapython.backend.repositories.StudentCourseEnrollmentRepository;
import com.coders.backers.plataformapython.backend.services.CourseService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private CourseRepository courseRepository;
    private TeacherRepository teacherRepository;
    private StudentRepository studentRepository;
    private StudentCourseEnrollmentRepository enrollmentRepository;

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

        // Eliminar el curso (las lecciones y todo lo relacionado se eliminará en cascada)
        courseRepository.delete(courseEntity);
    }

    @Override
    public void deleteCourse(Long id, Authentication authentication) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));

        // Verificar si el usuario es admin o si es el docente asignado al curso
        String userEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            // Verificar si el docente está asignado a este curso
            boolean isTeacherOfCourse = courseEntity.getTeachers().stream()
                    .anyMatch(teacher -> teacher.getEmail().equals(userEmail));
            
            if (!isTeacherOfCourse) {
                throw new RuntimeException("No tienes permisos para eliminar este curso");
            }
        }

        // Eliminar el curso (las lecciones y todo lo relacionado se eliminará en cascada)
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
    public List<CourseDto> getCoursesByTeacherId(long id) {
        List<CourseEntity> coursesByTeacher = courseRepository.findByTeachers_Id(id);
        return coursesByTeacher.stream()
                .map(CourseMapper::mapToModelDto)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto createCourseByTeacherId(CreateCourseDto createCourseDto, Long teacherId) {
        TeacherEntity teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        CourseEntity courseEntity = CourseMapper.mapFromCreateDto(createCourseDto);

        CourseEntity savedCourse = courseRepository.save(courseEntity);

        savedCourse.getTeachers().add(teacher);
        teacher.getCourses().add(savedCourse);

        courseRepository.save(savedCourse);
        teacherRepository.save(teacher);

        return CourseMapper.mapToModelDto(savedCourse);
    }

    @Override
    public void assignStudentsToCourse(Long courseId, List<Long> studentIds, Authentication authentication) {
        // Verificar que el curso existe
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + courseId));

        // Verificar permisos (solo admin o docente asignado al curso puede asignar estudiantes)
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            boolean isAssignedTeacher = course.getTeachers().stream()
                    .anyMatch(teacher -> teacher.getEmail().equals(username));
            
            if (!isAssignedTeacher) {
                throw new RuntimeException("No tienes permisos para asignar estudiantes a este curso");
            }
        }

        // Procesar cada estudiante
        for (Long studentId : studentIds) {
            StudentEntity student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con id: " + studentId));

            // Verificar si ya está inscrito
            boolean alreadyEnrolled = enrollmentRepository.findByStudentAndCourse(student, course).isPresent();
            
            if (!alreadyEnrolled) {
                StudentCourseEnrollmentEntity enrollment = new StudentCourseEnrollmentEntity();
                enrollment.setCourse(course);
                enrollment.setStudent(student);
                enrollment.setEnrollmentDate(new java.sql.Date(System.currentTimeMillis()));
                enrollment.setStatus(com.coders.backers.plataformapython.backend.enums.EnrollmentStatus.ACTIVE);
                
                enrollmentRepository.save(enrollment);
            }
        }
    }

    @Override
    public List<StudentDto> getUnassignedStudents(Long courseId) {
        // Verificar que el curso existe
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + courseId));

        // Obtener todos los estudiantes
        List<StudentEntity> allStudents = studentRepository.findAll();

        // Filtrar los que ya están inscritos en el curso
        List<StudentEntity> enrolledStudents = enrollmentRepository.findByCourse(course)
                .stream()
                .map(StudentCourseEnrollmentEntity::getStudent)
                .collect(Collectors.toList());

        // Obtener estudiantes no inscritos
        List<StudentEntity> unassignedStudents = allStudents.stream()
                .filter(student -> !enrolledStudents.contains(student))
                .collect(Collectors.toList());

        return unassignedStudents.stream()
                .map(StudentMapper::mapToDto)
                .collect(Collectors.toList());
    }
}