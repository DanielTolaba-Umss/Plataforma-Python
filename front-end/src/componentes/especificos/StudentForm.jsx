// src/components/students/StudentForm.jsx
import React, { useState } from "react";
import "/src/estilos/StudentForm.css";
import Button from "../comunes/Button";

const StudentForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [correo, setCorreo] = useState(initialData.correo || "");
  const [curso, setCurso] = useState(initialData.curso || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, correo, curso });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {initialData.id ? "Editar Estudiante" : "Nuevo Estudiante"}
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
        <label>Curso:</label>
        <input
          type="text"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
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

export default StudentForm;
