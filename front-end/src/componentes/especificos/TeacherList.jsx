import React, { useState } from "react";
import "../../estilos/TeacherList.css";
import DeleteModal from "../comunes/DeleteModal";
import { Pencil, Trash } from "lucide-react";

const initialTeachers = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    email: "carlos@pythonedu.com",
    modulos: ["Python Básico", "Python Intermedio"],
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria@pythonedu.com",
    modulos: ["Django Framework"],
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Javier López",
    email: "javier@pythonedu.com",
    modulos: ["Data Science con Python"],
    estado: "Inactivo",
  },
];

const TeacherList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [teachers, setTeachers] = useState(initialTeachers);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    id: null,
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    modulos: "",
    password_hash: "",
    activo: true,
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewTeacher({
      id: null,
      nombre: "",
      email: "",
      modulos: "",
      estado: "Activo",
    });
  };

  const handleChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    const { nombres, apellidos, email, telefono, modulos, password_hash } =
      newTeacher;

    if (
      !nombres ||
      !apellidos ||
      !email ||
      !telefono ||
      !modulos ||
      !password_hash
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevoDocente = {
      ...newTeacher,
      id: Date.now(),
      modulos: modulos.split(",").map((m) => m.trim()),
    };

    setTeachers((prev) => [...prev, nuevoDocente]);
    toggleForm();
  };

  const handleEdit = (docente) => {
    setEditMode(true);
    setShowForm(true);
    setNewTeacher({
      ...docente,
      modulos: docente.modulos.join(", "),
      password_hash: "", // no precargar la contraseña
    });
  };

  const handleUpdate = () => {
    const { nombres, apellidos, email, telefono, modulos, password_hash } =
      newTeacher;

    if (
      !nombres ||
      !apellidos ||
      !email ||
      !telefono ||
      !modulos ||
      !password_hash
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const actualizado = {
      ...newTeacher,
      modulos: modulos.split(",").map((m) => m.trim()),
    };

    setTeachers((prev) =>
      prev.map((doc) => (doc.id === actualizado.id ? actualizado : doc))
    );
    toggleForm();
  };

  const confirmDelete = (docente) => {
    setTeacherToDelete(docente);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setTeachers((prev) =>
      prev.filter((docente) => docente.id !== teacherToDelete.id)
    );
    setShowDeleteModal(false);
  };

  return (
    <div className="teacher-container">
      <div className="header-teacher">
        <h2>Gestión de Docentes</h2>
        <button className="btn-nuevo" onClick={toggleForm}>
          + Nuevo Docente
        </button>
      </div>

      {showForm && (
        <div className="formulario-docente-inline">
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={newTeacher.nombres}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={newTeacher.apellidos}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={newTeacher.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={newTeacher.telefono}
            onChange={handleChange}
          />
          <input
            type="text"
            name="modulos"
            placeholder="Módulos (separados por coma)"
            value={newTeacher.modulos}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password_hash"
            placeholder="Contraseña"
            value={newTeacher.password_hash}
            onChange={handleChange}
          />
          <select
            name="activo"
            value={newTeacher.activo ? "Activo" : "Inactivo"}
            onChange={(e) =>
              setNewTeacher({
                ...newTeacher,
                activo: e.target.value === "Activo",
              })
            }
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
              Crear Docente
            </button>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="🔍 Buscar docentes..."
        className="input-busqueda"
      />

      <table className="tabla-docentes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Módulos</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th>Contraseña</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((docente) => (
            <tr key={docente.id}>
              <td>
                {docente.nombres} {docente.apellidos}
              </td>
              <td>{docente.email}</td>
              <td>
                <div className="modulo-etiquetas">
                  {docente.modulos.map((modulo, idx) => (
                    <span key={idx} className="etiqueta-modulo">
                      {modulo}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <span className={`estado ${docente.estado.toLowerCase()}`}>
                  {docente.estado}
                </span>
              </td>
              <td className="acciones">
                <Pencil
                  size={18}
                  className="accion editar"
                  onClick={() => handleEdit(docente)}
                />
                <Trash
                  size={18}
                  className="accion eliminar"
                  onClick={() => confirmDelete(docente)}
                />
              </td>
              <td>********</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={teacherToDelete?.nombre}
          itemType="docente"
        />
      )}
    </div>
  );
};

export default TeacherList;
