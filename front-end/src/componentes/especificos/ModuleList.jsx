import React, { useState } from "react";
import "../../estilos/ModuleList.css";
import { Pencil, Trash } from "lucide-react";
import DeleteModal from "../comunes/DeleteModal"; // Ajusta la ruta si está en otra carpeta

const initialModules = [
  {
    id: 1,
    nombre: "Python Básico",
    estudiantes: 45,
    docentes: 2,
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Python Intermedio",
    estudiantes: 32,
    docentes: 1,
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Django Framework",
    estudiantes: 28,
    docentes: 2,
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Data Science con Python",
    estudiantes: 15,
    docentes: 1,
    estado: "Inactivo",
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
    nombre: "",
    estudiantes: "",
    docentes: "",
    estado: "Activo",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewModule({
      id: null,
      nombre: "",
      estudiantes: "",
      docentes: "",
      estado: "Activo",
    });
  };

  const handleChange = (e) => {
    setNewModule({ ...newModule, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!newModule.nombre || !newModule.estudiantes || !newModule.docentes) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevo = {
      ...newModule,
      id: Date.now(),
      estudiantes: parseInt(newModule.estudiantes),
      docentes: parseInt(newModule.docentes),
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
      nombre: "",
      estudiantes: "",
      docentes: "",
      estado: "Activo",
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
            name="nombre"
            placeholder="Nombre del módulo"
            value={newModule.nombre}
            onChange={handleChange}
          />
          <input
            type="number"
            name="estudiantes"
            placeholder="Cantidad de estudiantes"
            value={newModule.estudiantes}
            onChange={handleChange}
          />
          <input
            type="number"
            name="docentes"
            placeholder="Cantidad de docentes"
            value={newModule.docentes}
            onChange={handleChange}
          />
          <select
            name="estado"
            value={newModule.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
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
            <th>Nombre</th>
            <th>Estudiantes</th>
            <th>Docentes</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((modulo) => (
            <tr key={modulo.id}>
              <td>{modulo.nombre}</td>
              <td>{modulo.estudiantes}</td>
              <td>{modulo.docentes}</td>
              <td>
                <span className={`estado ${modulo.estado.toLowerCase()}`}>
                  {modulo.estado}
                </span>
              </td>
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
