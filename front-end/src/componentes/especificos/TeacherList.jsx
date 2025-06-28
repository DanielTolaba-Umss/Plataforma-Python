import React, { useState, useEffect } from "react";
import "../../estilos/TeacherList.css";
import DeleteModal from "../comunes/DeleteModal";
import { Edit, Trash2, X } from "lucide-react";
import { teachersAPI } from "../../api/docentesService";
import LoadingModal from "../comunes/LoadingModal";
import ProcessModal from "../comunes/ProcessModal";

const TeacherList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
  const [errores, setErrores] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
    return regex.test(password);
  };

  // Dentro del componente
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await teachersAPI.obtenerTodosDocente();
        setTeachers(response.data);
        console.log("Docentes obtenidos", response.data);
      } catch (error) {
        console.error("Error al obtener docentes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";

    if (name === "name" || name === "lastName") {
      const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
      if (!soloLetras.test(value)) {
        errorMsg = "Solo se permiten letras.";
      }
    }

    if (name === "phone") {
      const soloNumeros = /^[0-9]*$/;
      if (!soloNumeros.test(value)) {
        errorMsg = "Solo se permiten números.";
      } else if (value.length > 8) {
        errorMsg = "Máximo 8 caracteres.";
      }
    }

    if (name === "password") {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
      if (value && !regex.test(value)) {
        errorMsg = "La contraseña no cumple los requisitos.";
      }
    }

    setErrores((prev) => ({ ...prev, [name]: errorMsg }));
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleCreate = async () => {
    const { name, lastName, email, phone, password } = newTeacher;

    if (!name || !lastName || !email || !phone || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (!validarPassword(password)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial (@#$%^&+=)"
      );
      return;
    }

    try {
      setProcessing(true);
      const response = await teachersAPI.crearDocente(newTeacher);
      const docenteCreado = response.data;
      setTeachers((prev) => [...prev, docenteCreado]);
      toggleForm();
    } catch (error) {
      console.error("Error al crear docente:", error);
      alert("Hubo un error al crear el docente.");
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (docente) => {
    setEditMode(true);
    setShowForm(true);
    setNewTeacher({
      ...docente,
      password: "",
    });
  };

  const handleUpdate = async () => {
    const { id, name, lastName, email, phone, password, specialty, active } =
      newTeacher;

    if (!name || !lastName || !email || !phone || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (!validarPassword(password)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial (@#$%^&+=)"
      );
      return;
    }

    const actualizado = {
      name,
      lastName,
      email,
      phone,
      password,
      specialty,
      active,
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
    <>
      <div className="contenedor-docentes">
        <div className="encabezado-docentes">
          <h2>Gestión de Docentes</h2>
          <button className="btn-nuevo-docente" onClick={toggleForm}>
            + Nuevo Docente
          </button>
        </div>

        {showForm && (
          <div className="teacher-modal-overlay">
            <div className="teacher-modal">
              <div className="teacher-modal-header">
                <h3 className="teacher-modal-title">
                  {editMode ? "Editar Docente" : "Nuevo Docente"}
                </h3>
                <button className="teacher-modal-close" onClick={toggleForm}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-form-grid">
                <div className="modal-form-full">
                  <label htmlFor="name">Nombres</label>
                  <input
                    name="name"
                    placeholder="Nombres"
                    value={newTeacher.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                  {errores.name && <p className="error-text">{errores.name}</p>}
                </div>
                <div className="modal-form-full">
                  <label htmlFor="lastName">Apellidos</label>
                  <input
                    name="lastName"
                    placeholder="Apellidos"
                    value={newTeacher.lastName}
                    onChange={handleChange}
                    className="input-field"
                  />
                  {errores.lastName && (
                    <p className="error-text">{errores.lastName}</p>
                  )}{" "}
                  {/* Cambiado */}
                </div>
                <div className="modal-form-full">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={newTeacher.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    name="phone"
                    placeholder="Teléfono"
                    value={newTeacher.phone}
                    onChange={handleChange}
                    maxLength={8}
                    className="input-field"
                  />
                  {errores.phone && (
                    <p className="error-text">{errores.phone}</p>
                  )}{" "}
                  {/* Cambiado */}
                </div>
                <div>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={newTeacher.password}
                    onChange={handleChange}
                    className="input-field"
                  />
                  {/* Instrucción con estilo */}
                  <p className="instruction-text">
                    La contraseña debe tener al menos 8 caracteres, una
                    mayúscula, una minúscula, un número y un carácter especial
                    (@#$%^&+=)
                  </p>
                  {/* Error */}
                  {errores.password && (
                    <p className="error-text">{errores.password}</p>
                  )}
                </div>

                <div className="modal-form-full">
                  <label htmlFor="specialty">Especialidad</label>
                  <input
                    name="specialty"
                    placeholder="Especialidad"
                    value={newTeacher.specialty}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="modal-action-buttons">
                  <button onClick={toggleForm} className="btn-cancel">
                    Cancelar
                  </button>
                  <button
                    onClick={editMode ? handleUpdate : handleCreate}
                    className="btn-crear"
                  >
                    {editMode ? "Guardar Cambios" : "Crear Docente"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          className="input-busqueda-docente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="tabla-docentes">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((docente) => (
              <tr key={docente.id}>
                <td>
                  {docente.name} {docente.lastName}
                </td>
                <td>{docente.email}</td>
                <td>{docente.phone}</td>
                <td>{docente.specialty}</td>
                <td className="acciones-docente">
                  <button
                    className="boton-editar-docente"
                    onClick={() => handleEdit(docente)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="boton-eliminar-docente"
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
      {/* Modales*/}
      <LoadingModal
        isOpen={loading}
        mensaje="Cargando docentes, por favor espere..."
      />
      <ProcessModal
        isOpen={processing}
        mensaje="Creando docente, por favor espere..."
      />
    </>
  );
};

export default TeacherList;
