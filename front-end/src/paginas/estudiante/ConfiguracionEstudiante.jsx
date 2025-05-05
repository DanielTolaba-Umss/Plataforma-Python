import React, { useState } from "react";
import "/src/paginas/estudiante/estilos/ConfiguracionEstudiante.css";

const ConfiguracionEstudiante = () => {
  const [formData, setFormData] = useState({
    nombre: "Ana",
    apellidos: "García",
    email: "ana.garcia@ejemplo.com",
    telefono: "+591 72295337",
    ubicacion: "Bolivia-Cbba",
    biografia:
      "Estudiante de informática con interés en desarrollo web y ciencia de datos. Actualmente aprendiendo Python y sus frameworks.",
    contraseñaActual: "",
    nuevaContraseña: "",
    confirmarContraseña: "",
    notificaciones: true,
    actualizaciones: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se puede enviar al backend
    console.log("Datos guardados:", formData);
  };

  return (
    <div className="configuracion-container">
      <h2>Editar Perfil</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="avatar">
          <img
            src="https://i.pravatar.cc/100?img=3" // Puedes cambiar esta URL por la imagen real del usuario
            alt="Foto de perfil"
            className="avatar-image"
          />
          <button type="button" className="btn-foto">
            Cambiar Foto
          </button>
        </div>

        <div className="form-grid">
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />

        <label>Ubicación</label>
        <input
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
        />

        <label>Biografía</label>
        <textarea
          name="biografia"
          value={formData.biografia}
          onChange={handleChange}
          rows="3"
        />

        <hr />

        <h4>Cambiar Contraseña</h4>
        <label>Contraseña Actual</label>
        <input
          type="password"
          name="contraseñaActual"
          value={formData.contraseñaActual}
          onChange={handleChange}
        />

        <label>Nueva Contraseña</label>
        <input
          type="password"
          name="nuevaContraseña"
          value={formData.nuevaContraseña}
          onChange={handleChange}
        />

        <label>Confirmar Nueva Contraseña</label>
        <input
          type="password"
          name="confirmarContraseña"
          value={formData.confirmarContraseña}
          onChange={handleChange}
        />

        <h4>Preferencias</h4>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="notificaciones"
              checked={formData.notificaciones}
              onChange={handleChange}
            />
            Recibir notificaciones por correo electrónico
          </label>
          <label>
            <input
              type="checkbox"
              name="actualizaciones"
              checked={formData.actualizaciones}
              onChange={handleChange}
            />
            Recibir actualizaciones de cursos
          </label>
        </div>

        <div className="btn-group">
          <button type="button" className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-guardar">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionEstudiante;
