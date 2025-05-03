import React, { useState } from "react";
import "../../estilos/StudentList.css";
import { Pencil, Trash } from "lucide-react";
import DeleteModal from "../comunes/DeleteModal";

const initialStudents = [
  {
    id: 1,
    nombre: "Ana García",
    email: "ana@ejemplo.com",
    modulos: ["Python Básico"],
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Pedro Martínez",
    email: "pedro@ejemplo.com",
    modulos: ["Python Básico", "Python Intermedio"],
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Laura Sánchez",
    email: "laura@ejemplo.com",
    modulos: ["Django Framework"],
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Miguel Torres",
    email: "miguel@ejemplo.com",
    modulos: ["Python Básico"],
    estado: "Inactivo",
  },
];

const StudentList = () => {
  const [students, setStudents] = useState(initialStudents);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    id: null,
    nombre: "",
    email: "",
    modulos: "",
    estado: "Activo",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewStudent({
      id: null,
      nombre: "",
      email: "",
      modulos: "",
      estado: "Activo",
    });
  };

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!newStudent.nombre || !newStudent.email || !newStudent.modulos) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevoEstudiante = {
      id: Date.now(),
      nombre: newStudent.nombre,
      email: newStudent.email,
      modulos: newStudent.modulos.split(",").map((m) => m.trim()),
      estado: newStudent.estado,
    };

    setStudents((prev) => [...prev, nuevoEstudiante]);
    toggleForm();
  };

  const handleEdit = (estudiante) => {
    setEditMode(true);
    setShowForm(true);
    setNewStudent({
      id: estudiante.id,
      nombre: estudiante.nombre,
      email: estudiante.email,
      modulos: estudiante.modulos.join(", "),
      estado: estudiante.estado,
    });
  };

  const handleUpdate = () => {
    if (!newStudent.nombre || !newStudent.email || !newStudent.modulos) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const actualizado = {
      id: newStudent.id,
      nombre: newStudent.nombre,
      email: newStudent.email,
      modulos: newStudent.modulos.split(",").map((m) => m.trim()),
      estado: newStudent.estado,
    };

    setStudents((prev) =>
      prev.map((e) => (e.id === actualizado.id ? actualizado : e))
    );

    toggleForm();
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setStudents((prev) => prev.filter((e) => e.id !== selectedStudent.id));
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="student-container">
      <div className="header-student">
        <h2>Gestión de Estudiantes</h2>
        <button className="btn-nuevo" onClick={toggleForm}>
          + Nuevo Estudiante
        </button>
      </div>

      {showForm && (
        <div className="formulario-estudiante-inline">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={newStudent.nombre}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={newStudent.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="modulos"
            placeholder="Módulos (separados por coma)"
            value={newStudent.modulos}
            onChange={handleChange}
          />
          <select
            name="estado"
            value={newStudent.estado}
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
              Crear Estudiante
            </button>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="🔍 Buscar estudiantes..."
        className="input-busqueda"
      />

      <table className="tabla-estudiantes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Módulos Inscritos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.email}</td>
              <td>
                <div className="modulo-etiquetas">
                  {e.modulos.map((m, idx) => (
                    <span key={idx} className="etiqueta-modulo">
                      {m}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <span className={`estado ${e.estado.toLowerCase()}`}>
                  {e.estado}
                </span>
              </td>
              <td className="acciones">
                <Pencil
                  size={18}
                  className="accion editar"
                  onClick={() => handleEdit(e)}
                />
                <Trash
                  size={18}
                  className="accion eliminar"
                  onClick={() => openDeleteModal(e)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={selectedStudent?.nombre}
        itemType="estudiante"
      />
    </div>
  );
};

export default StudentList;
