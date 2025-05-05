// src/components/modules/ModuleForm.jsx
import React, { useState } from "react";
import "/src/estilos/ModuleForm.css";
import Button from "../comunes/Button";

const ModuleForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
  const [fecha, setFecha] = useState(initialData.fecha || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, descripcion, fecha });
  };

  return (
    <form className="module-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {initialData.id ? "Editar Módulo" : "Nuevo Módulo"}
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
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
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

export default ModuleForm;
