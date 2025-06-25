import React, { useState, useEffect } from "react";
import { adminAPI } from "../../api/adminService";
import { courseService } from "../../api/courseService";
import useToast from "../../hooks/useToast";
import ToastContainer from "../comunes/ToastContainer";

const TeacherAssignmentForm = ({ onCancel }) => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    specialty: "",
    userType: "TEACHER",
    courseId: ""
  });
    const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Error cargando cursos:", error);
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
    
    // Validación del teléfono (obligatorio para profesores)
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^[\d\s\-+()]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Ingrese un número de teléfono válido (8-15 dígitos)";
    }
    
    if (!formData.specialty.trim()) {
      newErrors.specialty = "La especialidad es obligatoria";
    } else if (formData.specialty.trim().length < 3) {
      newErrors.specialty = "La especialidad debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Limpiar errores previos
    
    try {
      const _response = await adminAPI.createUserWithEnrollment(formData);
      
      // Mostrar notificación de éxito
      showSuccess(
        `Profesor ${formData.firstName} ${formData.lastName} creado exitosamente. Las credenciales han sido enviadas por email.`,
        5000
      );
      
      // Mostrar mensaje de éxito en el formulario también
      setSuccessMessage(`Profesor ${formData.firstName} ${formData.lastName} creado exitosamente. Las credenciales han sido enviadas por email.`);
        // Resetear formulario
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        specialty: "",
        userType: "TEACHER",
        courseId: ""
      });
      
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
          setErrors({ submit: backendMessage || "Error al crear el profesor" });
          showError(backendMessage || "Error al crear el profesor");
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
    
    // Validar entrada de teléfono solo números
    if (name === "phone" && value && !/^\d*$/.test(value)) {
      return;
    }
    
    // Limitar teléfono a 8 dígitos
    if (name === "phone" && value.length > 8) {
      return;
    }
    
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
    }
  };  return (
    <>
      <ToastContainer toasts={toasts} onClose={hideToast} />
      <div className="modal-overlay">
      <div className="modal-content">
        <h3>Crear Profesor con Asignación a Curso</h3>
        
        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-row">
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
                placeholder="profesor@universidad.edu"
                required
                maxLength="100"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">            <div className="form-group">
              <label data-required="true">Teléfono:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ej: 12345678 (8 dígitos)"
                maxLength="8"
                className={errors.phone ? "error" : ""}
                required
                pattern="[0-9]{8}"
                title="Debe contener exactamente 8 dígitos"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
              <div className="form-group">
              <label data-required="true">Especialidad:</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="Ej: Programación Python, Ciencias de Datos"
                className={errors.specialty ? "error" : ""}
                required
                minLength="3"
                maxLength="100"
              />
              {errors.specialty && <span className="error-text">{errors.specialty}</span>}
            </div>
          </div>          <div className="form-group">
            <label data-required="true">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              placeholder="Mínimo 6 caracteres"
              required
              minLength="6"
              maxLength="50"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <small className="help-text">
              Mínimo 6 caracteres. Puede incluir letras, números y símbolos.
            </small>
          </div>

          <div className="form-group">
            <label>Curso a asignar (opcional):</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
            >
              <option value="">Sin asignar curso específico</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.level})
                </option>
              ))}
            </select>
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
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-submit"
            >
              {loading ? "Creando..." : "Crear Profesor"}
            </button>          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default TeacherAssignmentForm;
