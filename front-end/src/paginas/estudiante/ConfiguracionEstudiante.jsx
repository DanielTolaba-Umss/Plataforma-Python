import React, { useState, useEffect } from "react";
import "/src/paginas/estudiante/estilos/ConfiguracionEstudiante.css";
import studentProfileService from '../../api/studentProfileService';

const ConfiguracionEstudiante = ({ studentProfile, onProfileUpdate }) => {  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    // Campos para cambio de contraseña
    contraseñaActual: "",
    nuevaContraseña: "",
    confirmarContraseña: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del perfil cuando el componente se monta
  useEffect(() => {
    if (studentProfile) {
      setFormData(prev => ({
        ...prev,
        nombres: studentProfile.nombres || "",
        apellidos: studentProfile.apellidos || "",
        email: studentProfile.email || "",
        telefono: studentProfile.telefono || "",
      }));
    }
  }, [studentProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
      // Limpiar mensajes cuando el usuario modifica algo
    if (error) setError(null);
    if (success) {
      setSuccess(false);
      setSuccessMessage("");
    }
  };
  const validateForm = () => {
    const { nombres, apellidos, email, telefono, contraseñaActual, nuevaContraseña, confirmarContraseña } = formData;
    
    if (!nombres.trim() || nombres.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    
    if (!apellidos.trim() || apellidos.length < 2) {
      setError("Los apellidos deben tener al menos 2 caracteres");
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError("Debe proporcionar un email válido");
      return false;
    }
    
    if (telefono && !/^[0-9]{8}$/.test(telefono)) {
      setError("El teléfono debe tener exactamente 8 dígitos");
      return false;
    }

    // Validaciones de contraseña (solo si se está intentando cambiar)
    if (contraseñaActual || nuevaContraseña || confirmarContraseña) {
      if (!contraseñaActual.trim()) {
        setError("Debe proporcionar su contraseña actual");
        return false;
      }
        if (!nuevaContraseña.trim() || nuevaContraseña.length < 8) {
        setError("La nueva contraseña debe tener al menos 8 caracteres");
        return false;
      }
      
      if (nuevaContraseña !== confirmarContraseña) {
        setError("Las contraseñas no coinciden");
        return false;
      }
    }    
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos para enviar al backend
      const updateData = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim()
      };
      
      // Actualizar perfil en el backend
      const updatedProfile = await studentProfileService.updateProfile(updateData);
      
      // Si hay datos de contraseña, cambiar contraseña por separado
      const { contraseñaActual, nuevaContraseña, confirmarContraseña } = formData;
      if (contraseñaActual && nuevaContraseña && confirmarContraseña) {
        const changePasswordData = {
          currentPassword: contraseñaActual,
          newPassword: nuevaContraseña,
          confirmPassword: confirmarContraseña
        };
          await studentProfileService.changePassword(changePasswordData);
        
        // Limpiar campos de contraseña después del cambio exitoso
        setFormData(prev => ({
          ...prev,
          contraseñaActual: "",
          nuevaContraseña: "",
          confirmarContraseña: ""
        }));        console.log("Contraseña cambiada exitosamente");
      }
      
      // Determinar mensaje de éxito específico
      const passwordChanged = formData.contraseñaActual && formData.nuevaContraseña && formData.confirmarContraseña;
      
      setSuccessMessage(passwordChanged ? 
        "¡Perfil y contraseña actualizados exitosamente!" : 
        "¡Perfil actualizado exitosamente!"
      );
      setSuccess(true);
      
      // Notificar al componente padre sobre la actualización
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      
      console.log("Perfil actualizado exitosamente:", updatedProfile);
      
      // Opcional: cerrar el modal después de un breve delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
        } catch (err) {
      console.error("Error actualizando perfil:", err);
      
      // Determinar mensaje de error más específico
      let errorMessage = "Error al actualizar el perfil";
      
      if (err.message) {
        if (err.message.includes("contraseña actual es incorrecta") || 
            err.message.includes("current password") ||
            err.message.includes("incorrect")) {
          errorMessage = "La contraseña actual que ingresaste es incorrecta";
        } else if (err.message.includes("cambiar contraseña") || 
                   err.message.includes("change password")) {
          errorMessage = "Error al cambiar la contraseña: " + err.message;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="configuracion-container">
      <h2>Editar Perfil</h2>

      {error && (
        <div className="error-message" style={{
          color: '#e74c3c',
          backgroundColor: '#fdf2f2',
          border: '1px solid #e74c3c',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (        <div className="success-message" style={{
          color: '#27ae60',
          backgroundColor: '#f2fdf2',
          border: '1px solid #27ae60',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '20px'
        }}>
          {successMessage || "¡Perfil actualizado exitosamente!"}
        </div>)}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label>Nombre *</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div>
            <label>Apellidos *</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <label>Correo Electrónico *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: 70123456"
          pattern="[0-9]{8}"
          title="Debe tener exactamente 8 dígitos"
        />

        {/* Sección de cambio de contraseña */}
        <div className="password-section">
          <h3>Cambiar Contraseña</h3>
          <p className="password-note">Deja estos campos vacíos si no deseas cambiar tu contraseña</p>
          
          <label>Contraseña Actual</label>
          <input
            type="password"
            name="contraseñaActual"
            value={formData.contraseñaActual}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña actual"
          />

          <label>Nueva Contraseña</label>          <input
            type="password"
            name="nuevaContraseña"
            value={formData.nuevaContraseña}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
          />

          <label>Confirmar Nueva Contraseña</label>
          <input
            type="password"
            name="confirmarContraseña"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            placeholder="Confirma tu nueva contraseña"
          />
        </div>

        <div className="btn-group">
          <button type="button" className="btn-cancelar">
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-guardar"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionEstudiante;
