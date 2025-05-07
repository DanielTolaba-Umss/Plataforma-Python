import React, { useState } from "react";
import "../../estilos/ModuleList.css";
import { Pencil, Trash } from "lucide-react";
import DeleteModal from "../comunes/DeleteModal"; // Ajusta la ruta si está en otra carpeta

const initialModules = [
  {
    id: 1,
    titulo: "Python Básico",
    descripcion: "Introducción al lenguaje Python",
    orden: 1,
  },
  {
    id: 2,
    titulo: "Python Intermedio",
    descripcion: "Estructuras y funciones intermedias",
    orden: 2,
  },
  {
    id: 3,
    titulo: "Django Framework",
    descripcion: "Desarrollo web con Django",
    orden: 3,
  },
  {
    id: 4,
    titulo: "Data Science con Python",
    descripcion: "Análisis de datos con Python",
    orden: 4,
  },
];

const ModuleList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [modules, setModules] = useState(initialModules);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newModule, setNewModule] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    orden: "",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewModule({
      id: null,
      titulo: "",
      descripcion: "",
      orden: "",
    });
  };

  const handleChange = (e) => {
    setNewModule({ ...newModule, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!newModule.titulo || !newModule.descripcion || !newModule.orden) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevo = {
      ...newModule,
      id: Date.now(),
      orden: parseInt(newModule.orden),
    };

    setModules((prev) => [...prev, nuevo]);
    resetForm();
  };

  const handleEdit = (modulo) => {
    setEditMode(true);
    setShowForm(true);
    setNewModule(modulo);
  };

  const handleUpdate = () => {
    setModules((prev) =>
      prev.map((mod) => (mod.id === newModule.id ? newModule : mod))
    );
    resetForm();
  };

  const handleDeleteClick = (id) => {
    setModuleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setModules((prev) => prev.filter((mod) => mod.id !== moduleToDelete));
    setShowDeleteModal(false);
    setModuleToDelete(null);
  };

  const resetForm = () => {
    setNewModule({
      id: null,
      titulo: "",
      descripcion: "",
      orden: "",
    });
    setShowForm(false);
    setEditMode(false);
  };

  return (
    <div className="modulo-container">
      <div className="header-modulo">
        <h2>Gestión de Módulos</h2>
        <button className="btn-nuevo" onClick={toggleForm}>
          + Nuevo Módulo
        </button>
      </div>

      {showForm && (
        <div className="formulario-modulo">
          <input
            type="text"
            name="titulo"
            placeholder="Título del módulo"
            value={newModule.titulo}
            onChange={handleChange}
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={newModule.descripcion}
            onChange={handleChange}
          />
          <input
            type="number"
            name="orden"
            placeholder="Orden"
            value={newModule.orden}
            onChange={handleChange}
          />
          {editMode ? (
            <button className="btn-crear" onClick={handleUpdate}>
              Guardar Cambios
            </button>
          ) : (
            <button className="btn-crear" onClick={handleCreate}>
              Crear Módulo
            </button>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="🔍 Buscar módulos..."
        className="input-busqueda"
      />

      <table className="tabla-modulos">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Orden</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((modulo) => (
            <tr key={modulo.id}>
              <td>{modulo.titulo}</td>
              <td>{modulo.descripcion}</td>
              <td>{modulo.orden}</td>
              <td className="acciones">
                <Pencil
                  size={18}
                  className="accion editar"
                  onClick={() => handleEdit(modulo)}
                />
                <Trash
                  size={18}
                  className="accion eliminar"
                  onClick={() => handleDeleteClick(modulo.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ModuleList;
