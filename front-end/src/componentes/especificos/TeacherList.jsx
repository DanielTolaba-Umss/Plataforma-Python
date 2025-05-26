import React, { useState, useEffect } from "react";
import "../../estilos/TeacherList.css";
import DeleteModal from "../comunes/DeleteModal";
import { Edit, Trash2 } from "lucide-react";
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
      setLoading(true); // 👈 Mostrar modal
      try {
        const response = await teachersAPI.obtenerTodosDocente();
        setTeachers(response.data);
      } catch (error) {
        console.error("Error al obtener docentes:", error);
      } finally {
        setLoading(false); // 👈 Ocultar modal
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
      setProcessing(true); //Mostrar el modal process
      const response = await teachersAPI.crearDocente(newTeacher);
      const docenteCreado = response.data;

      setTeachers((prev) => [...prev, docenteCreado]);
      toggleForm();
    } catch (error) {
      console.error("Error al crear docente:", error);
      alert("Hubo un error al crear el docente.");
    } finally {
      setProcessing(false); // 👈 Ocultar el modal
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
    <>
      <div className="contenedor-docentes">
        <div className="encabezado-docentes">
          <h2>Gestión de Docentes</h2>
          <button className="btn-nuevo-docente" onClick={toggleForm}>
            + Nuevo Docente
          </button>
        </div>

        {showForm && (
          <form className="formulario-docente">
            <div className="grid-formulario">
              <div className="grupo-formulario">
                <label htmlFor="name">Nombres</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newTeacher.name}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="lastName">Apellidos</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={newTeacher.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={newTeacher.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={newTeacher.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={newTeacher.password}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-formulario">
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

            <div className="botones-formulario-docente">
              {editMode ? (
                <>
                  <button
                    type="button"
                    className="btn-guardar-cambios"
                    onClick={handleUpdate}
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar-formulario"
                    onClick={toggleForm}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-crear-docente"
                    onClick={handleCreate}
                  >
                    Crear Docente
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar-formulario"
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
          className="input-busqueda-docente"
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
