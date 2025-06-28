package com.coders.backers.plataformapython.backend.services;

import com.coders.backers.plataformapython.backend.dto.CreateUserWithEnrollmentRequest;
import com.coders.backers.plataformapython.backend.dto.UserCreationResponse;
import com.coders.backers.plataformapython.backend.dto.student.CreateStudentDto;
import com.coders.backers.plataformapython.backend.dto.student.StudentDto;
import com.coders.backers.plataformapython.backend.dto.teacher.CreateTeacherDto;
import com.coders.backers.plataformapython.backend.dto.teacher.TeacherDto;
import com.coders.backers.plataformapython.backend.dto.course.CourseDto;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
import com.coders.backers.plataformapython.backend.models.userModel.TeacherEntity;
import com.coders.backers.plataformapython.backend.models.CourseEntity;
import com.coders.backers.plataformapython.backend.models.LessonEntity;
import com.coders.backers.plataformapython.backend.models.StudentCourseEnrollmentEntity;
import com.coders.backers.plataformapython.backend.repository.StudentRepository;
import com.coders.backers.plataformapython.backend.repository.TeacherRepository;
import com.coders.backers.plataformapython.backend.repository.CourseRepository;
import com.coders.backers.plataformapython.backend.repository.LessonRepository;
import com.coders.backers.plataformapython.backend.services.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminUserCreationService {

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;
      @Autowired
    private CourseService courseService;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private ProgressService progressService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private EmailService emailService;

    /**
     * Crea un usuario con inscripción automática (para estudiantes) o asignación (para profesores)
     */
    public UserCreationResponse createUserWithEnrollment(CreateUserWithEnrollmentRequest request) {
        try {
            // Validaciones básicas
            if (!request.isValid()) {
                return UserCreationResponse.error("Datos de entrada inválidos");
            }            // Verificar si el usuario ya existe por email
            if (studentRepository.findByEmail(request.getEmail()).isPresent() ||
                teacherRepository.existsByEmail(request.getEmail())) {
                return UserCreationResponse.error("Ya existe un usuario con ese email");
            }

            if (request.isStudent()) {
                return createStudentWithEnrollment(request);
            } else if (request.isTeacher()) {
                return createTeacherWithCourseAssignment(request);
            } else {
                return UserCreationResponse.error("Tipo de usuario no válido");
            }

        } catch (Exception e) {
            return UserCreationResponse.error("Error interno del servidor: " + e.getMessage());
        }
    }

    /**
     * Crea un estudiante y lo inscribe en un curso
     */
    private UserCreationResponse createStudentWithEnrollment(CreateUserWithEnrollmentRequest request) {
        // Validar que se proporcione un curso para el estudiante
        if (request.getCourseId() == null) {
            return UserCreationResponse.error("Es obligatorio especificar un curso para el estudiante");
        }

        // Buscar el curso
        CourseDto courseDto = courseService.getCourseById(request.getCourseId());
        if (courseDto == null) {
            return UserCreationResponse.error("Curso no encontrado");
        }        // Crear DTO para el estudiante
        CreateStudentDto studentDto = new CreateStudentDto();
        studentDto.setNombres(request.getFirstName());
        studentDto.setApellidos(request.getLastName());
        studentDto.setEmail(request.getEmail());
        studentDto.setTelefono(request.getPhone()); // Añadir el teléfono
        studentDto.setPassword(request.getPassword());
        
        // Asignar el curso al estudiante
        studentDto.setCursos(List.of(request.getCourseId()));

        // Crear el estudiante usando el servicio existente
        StudentDto createdStudent = studentService.createStudent(studentDto);

        // Obtener las entidades para la inscripción manual
        Optional<StudentEntity> studentEntityOpt = studentRepository.findById(createdStudent.getId());
        Optional<CourseEntity> courseEntityOpt = courseRepository.findById(request.getCourseId());
        
        if (studentEntityOpt.isEmpty() || courseEntityOpt.isEmpty()) {
            return UserCreationResponse.error("Error al crear la inscripción");
        }

        StudentEntity studentEntity = studentEntityOpt.get();
        CourseEntity courseEntity = courseEntityOpt.get();

        // Crear inscripción manual usando el EnrollmentService
        StudentCourseEnrollmentEntity enrollment = enrollmentService.enrollStudentInCourse(studentEntity, courseEntity);

        // Buscar la lección inicial si se especifica
        LessonEntity startingLesson = null;
        if (request.getStartingLessonId() != null) {
            Optional<LessonEntity> lessonOpt = lessonRepository.findById(request.getStartingLessonId());
            if (lessonOpt.isPresent() && lessonOpt.get().getCourse().getId().equals(courseEntity.getId())) {
                startingLesson = lessonOpt.get();
                // Marcar la lección como iniciada
                progressService.startLesson(studentEntity, startingLesson);            }
        }

        // Enviar email de bienvenida con credenciales
        try {
            emailService.sendWelcomeEmailWithCredentials(studentEntity, request.getPassword());
        } catch (Exception e) {
            // Log del error pero no fallar la creación del usuario
            System.err.println("Error enviando email de bienvenida: " + e.getMessage());
        }

        // Construir respuesta
        return new UserCreationResponse(
            createdStudent.getId(),
            createdStudent.getEmail(), // Usar email como username
            createdStudent.getEmail(),
            createdStudent.getNombres(),
            createdStudent.getApellidos(),
            enrollment.getId(),
            courseEntity.getId(),
            courseEntity.getTitle(),
            courseEntity.getLevel(),
            startingLesson != null ? startingLesson.getId() : null,
            startingLesson != null ? startingLesson.getTitle() : null
        );
    }    /**
     * Crea un profesor y lo asigna a un curso (opcional)
     */
    private UserCreationResponse createTeacherWithCourseAssignment(CreateUserWithEnrollmentRequest request) {        // Crear DTO para el profesor
        CreateTeacherDto teacherDto = new CreateTeacherDto();
        teacherDto.setName(request.getFirstName());
        teacherDto.setLastName(request.getLastName());
        teacherDto.setEmail(request.getEmail());
        teacherDto.setPassword(request.getPassword());
        
        // Asignar campos específicos de profesor con valores por defecto si no se proporcionan
        teacherDto.setPhone(request.getPhone() != null ? request.getPhone() : "000000000");
        teacherDto.setSpecialty(request.getSpecialty() != null ? request.getSpecialty() : "General");

        // Crear el profesor usando el servicio existente
        TeacherDto createdTeacher = teacherService.createTeacher(teacherDto);

        // Si se especifica un curso, asignar manualmente el profesor al curso
        if (request.getCourseId() != null) {
            try {
                CourseDto courseDto = courseService.getCourseById(request.getCourseId());
                if (courseDto != null) {
                    // Obtener las entidades para la asignación manual
                    Optional<TeacherEntity> teacherEntityOpt = teacherRepository.findById(createdTeacher.getId());
                    Optional<CourseEntity> courseEntityOpt = courseRepository.findById(request.getCourseId());
                    
                    if (teacherEntityOpt.isPresent() && courseEntityOpt.isPresent()) {
                        TeacherEntity teacherEntity = teacherEntityOpt.get();
                        CourseEntity courseEntity = courseEntityOpt.get();
                        
                        // Agregar el profesor al curso
                        courseEntity.getTeachers().add(teacherEntity);
                        teacherEntity.getCourses().add(courseEntity);
                        
                        courseRepository.save(courseEntity);
                        teacherRepository.save(teacherEntity);
                    }
                }            } catch (Exception e) {
                // Continuar aunque falle la asignación del curso
                // El profesor se creó exitosamente
            }
        }

        // Enviar email de bienvenida con credenciales
        try {
            // Obtener la entidad del profesor creado para enviar el email
            Optional<TeacherEntity> teacherEntityOpt = teacherRepository.findById(createdTeacher.getId());
            if (teacherEntityOpt.isPresent()) {
                emailService.sendWelcomeEmailWithCredentials(teacherEntityOpt.get(), request.getPassword());
            }
        } catch (Exception e) {
            // Log del error pero no fallar la creación del usuario
            System.err.println("Error enviando email de bienvenida: " + e.getMessage());
        }

        return new UserCreationResponse(
            createdTeacher.getId(),
            createdTeacher.getEmail(), // Usar email como username
            createdTeacher.getEmail(),
            createdTeacher.getName(),
            createdTeacher.getLastName(),
            "TEACHER"        );
    }
}
