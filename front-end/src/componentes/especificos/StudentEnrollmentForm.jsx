import React, { useState, useEffect } from "react";
import { adminAPI } from "../../api/adminService";
import { courseService } from "../../api/courseService";
import useToast from "../../hooks/useToast";
import ToastContainer from "../comunes/ToastContainer";

const StudentEnrollmentForm = ({ onCancel }) => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    userType: "STUDENT",
    courseId: "",
    startingLessonId: ""
  });
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.courseId) {
      fetchLessons(formData.courseId);
    }
  }, [formData.courseId]);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Error cargando cursos:", error);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const response = await courseService.getLessonsByCourse(courseId);
      setLessons(response.data);
    } catch (error) {
      console.error("Error cargando lecciones:", error);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones de campos obligatorios
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username.trim())) {
      newErrors.username = "Solo se permiten letras, números, puntos, guiones y guiones bajos";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Ingrese un email válido (ejemplo: usuario@dominio.com)";
      }
    }
      if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
      // Validación del teléfono (opcional pero con formato si se proporciona)
    if (formData.phone.trim() && !/^[\d\s\-+()]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Ingrese un número de teléfono válido (8-15 dígitos)";
    }
    
    // Validación específica para estudiantes
    if (formData.userType === "STUDENT" && !formData.courseId) {
      newErrors.courseId = "Es obligatorio seleccionar un curso para el estudiante";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Limpiar errores previos
    
    try {
      const _response = await adminAPI.createUserWithEnrollment(formData);
      
      // Mostrar notificación de éxito
      showSuccess(
        `Estudiante ${formData.firstName} ${formData.lastName} creado exitosamente. Las credenciales han sido enviadas por email.`,
        5000
      );
      
      // Resetear formulario
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        userType: "STUDENT",
        courseId: "",
        startingLessonId: ""
      });      // Limpiar lecciones
      setLessons([]);
      
      // Mostrar mensaje de éxito en el formulario también
      setSuccessMessage(`Estudiante ${formData.firstName} ${formData.lastName} creado exitosamente. Las credenciales han sido enviadas por email.`);
      
      // No cerrar el modal automáticamente, dejar que el usuario vea la notificación
      // onSuccess se puede llamar desde el componente padre si es necesario
      
    } catch (error) {
      // Mapear errores específicos del backend
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message || error.response.data.error;
        
        if (backendMessage && backendMessage.includes("Ya existe un usuario con ese email")) {
          setErrors({ email: "Este email ya está registrado. Use otro email." });
          showError("Email ya registrado. Por favor use otro email.");
        } else if (backendMessage && backendMessage.includes("Curso no encontrado")) {
          setErrors({ courseId: "El curso seleccionado no es válido" });
          showError("El curso seleccionado no es válido.");
        } else if (backendMessage && backendMessage.includes("Datos de entrada inválidos")) {
          setErrors({ submit: "Por favor verifique que todos los campos están correctos" });
          showError("Por favor verifique que todos los campos están correctos.");
        } else {
          setErrors({ submit: backendMessage || "Error al crear el estudiante" });
          showError(backendMessage || "Error al crear el estudiante");
        }
      } else {
        const errorMsg = "Error de conexión. Intente nuevamente.";
        setErrors({ submit: errorMsg });
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }  };  return (
    <>
      <ToastContainer toasts={toasts} onClose={hideToast} />
      <div className="modal-overlay">
      <div className="modal-content">
        <h3>Crear Estudiante con Inscripción Automática</h3>
        
        <form onSubmit={handleSubmit} className="enrollment-form">          <div className="form-row">
            <div className="form-group">
              <label data-required="true">Nombre:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "error" : ""}
                placeholder="Ej: Juan Carlos"
                required
                minLength="2"
                maxLength="50"
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label data-required="true">Apellido:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "error" : ""}
                placeholder="Ej: Pérez García"
                required
                minLength="2"
                maxLength="50"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>          <div className="form-row">
            <div className="form-group">
              <label data-required="true">Nombre de usuario:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "error" : ""}
                placeholder="Ej: juan.perez2024"
                required
                minLength="3"
                maxLength="30"
                pattern="^[a-zA-Z0-9_.-]+$"
                title="Solo letras, números, puntos, guiones y guiones bajos"
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <label data-required="true">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
                placeholder="estudiante@universidad.edu"
                required
                maxLength="100"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div><div className="form-group">
            <label data-required="true">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
              required
              minLength="6"
              maxLength="100"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <span className="form-help">Mínimo 6 caracteres. El estudiante podrá cambiarla después</span>
          </div>

          <div className="form-group">
            <label>Teléfono (opcional):</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? "error" : ""}
              placeholder="Ej: +1234567890"
              maxLength="15"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-section">
            <div className="form-section-title">
              📚 Inscripción Automática a Curso
            </div>
            <div className="form-section-description">
              El estudiante será inscrito automáticamente en el curso seleccionado y tendrá acceso inmediato a todas las lecciones.
            </div>
          </div><div className="form-row">
            <div className="form-group">
              <label data-required="true">Curso:</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className={errors.courseId ? "error" : ""}
                required
              >
                <option value="">📚 Seleccionar curso obligatorio</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.level})
                  </option>
                ))}
              </select>
              {errors.courseId && <span className="error-text">{errors.courseId}</span>}
              <span className="form-help">⚠️ Obligatorio: El estudiante será inscrito automáticamente en este curso</span>
            </div>
            
            <div className="form-group">
              <label>Lección inicial (opcional):</label>
              <select
                name="startingLessonId"
                value={formData.startingLessonId}
                onChange={handleInputChange}
                disabled={!formData.courseId}
                className={!formData.courseId ? "disabled" : ""}
              >
                <option value="">🏁 Comenzar desde la primera lección</option>
                {lessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>
                    📖 {lesson.title}
                  </option>
                ))}
              </select>
              <span className="form-help">
                {!formData.courseId 
                  ? "💡 Primero selecciona un curso" 
                  : "💡 Opcional: Si no seleccionas, comenzará desde la primera lección del curso"
                }
              </span>
            </div>
          </div>          {successMessage && (
            <div className="success-message" style={{
              color: '#10b981',
              backgroundColor: '#f0fdf4',
              border: '1px solid #10b981',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontWeight: '500'
            }}>
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-submit"
            >
              {loading ? "Creando..." : "Crear Estudiante"}
            </button>          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default StudentEnrollmentForm;
