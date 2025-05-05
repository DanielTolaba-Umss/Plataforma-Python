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
    apellidos: "",
    email: "",
    telefono: "",
    ciudad: "",
    pais: "",
    password_hash: "",
    modulos: "",
    estado: "Activo",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewStudent({
      id: null,
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      ciudad: "",
      pais: "",
      password_hash: "",
      modulos: "",
      estado: "Activo",
    });
  };

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (
      !newStudent.nombre ||
      !newStudent.email ||
      !newStudent.modulos ||
      !newStudent.apellidos ||
      !newStudent.password_hash
    ) {
      alert("Todos los campos obligatorios deben estar llenos.");
      return;
    }

    const nuevoEstudiante = {
      id: Date.now(),
      nombre: newStudent.nombre,
      apellidos: newStudent.apellidos,
      email: newStudent.email,
      telefono: newStudent.telefono,
      ciudad: newStudent.ciudad,
      pais: newStudent.pais,
      password_hash: newStudent.password_hash,
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
      apellidos: estudiante.apellidos || "",
      email: estudiante.email,
      telefono: estudiante.telefono || "",
      ciudad: estudiante.ciudad || "",
      pais: estudiante.pais || "",
      password_hash: estudiante.password_hash || "",
      modulos: estudiante.modulos?.join(", ") || "",
      estado: estudiante.estado,
    });
  };

  const handleUpdate = () => {
    if (
      !newStudent.nombre ||
      !newStudent.email ||
      !newStudent.modulos ||
      !newStudent.apellidos
    ) {
      alert("Todos los campos obligatorios deben estar llenos.");
      return;
    }

    const actualizado = {
      id: newStudent.id,
      nombre: newStudent.nombre,
      apellidos: newStudent.apellidos,
      email: newStudent.email,
      telefono: newStudent.telefono,
      ciudad: newStudent.ciudad,
      pais: newStudent.pais,
      password_hash: newStudent.password_hash,
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
            name="nombre"
            placeholder="Nombre"
            value={newStudent.nombre}
            onChange={handleChange}
          />
          <input
            name="apellidos"
            placeholder="Apellidos"
            value={newStudent.apellidos}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={newStudent.email}
            onChange={handleChange}
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            value={newStudent.telefono}
            onChange={handleChange}
          />
          <input
            name="ciudad"
            placeholder="Ciudad"
            value={newStudent.ciudad}
            onChange={handleChange}
          />
          <input
            name="pais"
            placeholder="País"
            value={newStudent.pais}
            onChange={handleChange}
          />
          <input
            name="password_hash"
            type="password"
            placeholder="Contraseña"
            value={newStudent.password_hash}
            onChange={handleChange}
          />
          <input
            name="modulos"
            placeholder="Módulos (coma)"
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
          <button
            onClick={editMode ? handleUpdate : handleCreate}
            className="btn-crear"
          >
            {editMode ? "Guardar Cambios" : "Crear Estudiante"}
          </button>
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
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>País</th>
            <th>Contraseña</th>
            <th>Módulos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((e) => (
            <tr key={e.id}>
              <td>
                {e.nombre} {e.apellidos}
              </td>
              <td>{e.email}</td>
              <td>{e.telefono}</td>
              <td>{e.ciudad}</td>
              <td>{e.pais}</td>
              <td>{"*".repeat(8)}</td>
              <td>
                {e.modulos.map((m, i) => (
                  <span key={i} className="etiqueta-modulo">
                    {m}
                  </span>
                ))}
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
