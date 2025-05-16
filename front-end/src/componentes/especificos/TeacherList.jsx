import React, { useState, useEffect } from "react";
import "../../estilos/TeacherList.css";
import DeleteModal from "../comunes/DeleteModal";
import { Edit, Trash2 } from "lucide-react";
import { teachersAPI } from "../../api/docentesService";

const TeacherList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    specialty: "",
    active: true, // por defecto activo
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewTeacher({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      specialty: "",
    });
  };

  // Dentro del componente
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teachersAPI.obtenerTodosDocente();
        setTeachers(response.data);
      } catch (error) {
        console.error("Error al obtener docentes:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { name, lastName, email, phone, password } = newTeacher;

    if (!name || !lastName || !email || !phone || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await teachersAPI.crearDocente(newTeacher);
      const docenteCreado = response.data;

      setTeachers((prev) => [...prev, docenteCreado]);
      toggleForm();
    } catch (error) {
      console.error("Error al crear docente:", error);
      alert("Hubo un error al crear el docente.");
    }
  };

  const handleEdit = (docente) => {
    setEditMode(true);
    setShowForm(true);
    setNewTeacher({
      ...docente,
      password: "", // no precargar la contraseña
    });
  };

  const handleUpdate = async () => {
    const { id, name, lastName, email, phone, password, specialty, active } =
      newTeacher;

    if (!name || !lastName || !email || !phone || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const actualizado = {
      name,
      lastName,
      email,
      phone,
      password,
      specialty,
      active, // <--- aquí está la clave
    };

    try {
      await teachersAPI.actualizarDocente(id, actualizado);
      setTeachers((prev) =>
        prev.map((doc) => (doc.id === id ? { ...newTeacher } : doc))
      );
      toggleForm();
    } catch (error) {
      console.error("Error al actualizar docente:", error);
      alert("No se pudo actualizar el docente.");
    }
  };

  const confirmDelete = (docente) => {
    setTeacherToDelete(docente);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await teachersAPI.eliminarDocente(teacherToDelete.id);

      setTeachers((prev) =>
        prev.filter((docente) => docente.id !== teacherToDelete.id)
      );

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar docente:", error);
      alert("No se pudo eliminar el docente.");
    }
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
        <form className="formulario-docente">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombres</label>
              <input
                type="text"
                name="name"
                id="name"
                value={newTeacher.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellidos</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={newTeacher.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                value={newTeacher.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={newTeacher.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                name="password"
                id="password"
                value={newTeacher.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Especialidad</label>
              <input
                type="text"
                name="specialty"
                id="specialty"
                value={newTeacher.specialty}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="botones-formulario">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="btn-crear"
                  onClick={handleUpdate}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={toggleForm}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-crear"
                  onClick={handleCreate}
                >
                  Crear Docente
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={toggleForm}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
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
            <th>Teléfono</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((docente) => (
            <tr key={docente.id}>
              <td>
                {docente.name} {docente.lastName}
              </td>
              <td>{docente.email}</td>
              <td>{docente.phone}</td>
              <td>********</td>
              <td className="acciones">
                <button
                  className="accion editar"
                  onClick={() => handleEdit(docente)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="accion eliminar"
                  onClick={() => confirmDelete(docente)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={`${teacherToDelete?.name ?? ""} ${
            teacherToDelete?.lastName ?? ""
          }`}
          itemType="docente"
        />
      )}
    </div>
  );
};

export default TeacherList;
