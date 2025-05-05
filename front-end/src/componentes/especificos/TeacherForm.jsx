// src/components/teachers/TeacherForm.jsx
import React, { useState } from "react";
import "/src/componentes/especificos/TeacherForm.jsx";
import Button from "../comunes/Button";

const TeacherForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [correo, setCorreo] = useState(initialData.correo || "");
  const [especialidad, setEspecialidad] = useState(
    initialData.especialidad || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, correo, especialidad });
  };

  return (
    <form className="teacher-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {initialData.id ? "Editar Docente" : "Nuevo Docente"}
      </h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Correo:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Especialidad:</label>
        <input
          type="text"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <Button type="submit">Guardar</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;
