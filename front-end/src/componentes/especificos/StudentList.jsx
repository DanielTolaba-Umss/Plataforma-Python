import React, { useState, useEffect } from "react";
import "../../estilos/StudentList.css";
import { Pencil, Trash, X } from "lucide-react";
import DeleteModal from "../comunes/DeleteModal";
import { estudiantesApi } from "../../api/estudiantesService";

// Add mock courses data until backend is ready
const mockCourses = [
  { id: "1", title: "Python Básico", level: "Básico" },
  { id: "2", title: "Python Intermedio", level: "Intermedio" },
  { id: "3", title: "Python Avanzado", level: "Avanzado" },
  { id: "4", title: "Django Framework", level: "Intermedio" },
  { id: "5", title: "APIs con FastAPI", level: "Avanzado" },
];

// Los datos iniciales ahora vendrán de la API

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newStudent, setNewStudent] = useState({
    id: null,
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
    cursos: [],
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await estudiantesApi.listar();

        // Add mock courses data for UI purposes until backend is ready
        const studentsWithCourses = data.map((student) => ({
          ...student,
          cursos: student.cursos || [], // Keep any existing courses or initialize empty array
        }));

        setStudents(studentsWithCourses);
      } catch (error) {
        setError("Error al cargar los estudiantes: " + error.message);
        console.error("Error al cargar los estudiantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewStudent({
      id: null,
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      password: "",
      cursos: [],
    });
  };

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };
  const handleCreate = async () => {
    try {
      if (
        !newStudent.nombres ||
        !newStudent.email ||
        !newStudent.apellidos ||
        !newStudent.password
      ) {
        alert(
          "Los campos Nombres, Apellidos, Email y Contraseña son obligatorios."
        );
        return;
      }

      setLoading(true);
      const studentData = {
        nombres: newStudent.nombres,
        apellidos: newStudent.apellidos,
        email: newStudent.email,
        telefono: newStudent.telefono || null,
        password: newStudent.password,
        // Keep track of courses locally since the backend isn't ready
        cursos: newStudent.cursos || [],
      };

      const createdStudent = await estudiantesApi.crear(studentData);

      // Add the courses information to the created student for UI purposes
      const studentWithCourses = {
        ...createdStudent,
        cursos: newStudent.cursos,
      };

      setStudents((prev) => [...prev, studentWithCourses]);
      toggleForm();
      setError(null);
    } catch (error) {
      setError("Error al crear estudiante: " + error.message);
      console.error("Error creating student:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (estudiante) => {
    setEditMode(true);
    setShowForm(true);
    setNewStudent({
      id: estudiante.id,
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos || "",
      email: estudiante.email,
      telefono: estudiante.telefono || "",
      password: estudiante.password || "",
      cursos: estudiante.cursos || [],
    });
  };

  const handleUpdate = async () => {
    try {
      if (!newStudent.nombres || !newStudent.email || !newStudent.apellidos) {
        alert("Los campos Nombres, Apellidos y Email son obligatorios.");
        return;
      }

      setLoading(true);
      const studentData = {
        nombres: newStudent.nombres,
        apellidos: newStudent.apellidos,
        email: newStudent.email,
        telefono: newStudent.telefono || null,
        // Don't send password if it's empty (unchanged)
        ...(newStudent.password && { password: newStudent.password }),
      };

      const updatedStudent = await estudiantesApi.actualizar(
        newStudent.id,
        studentData
      );

      // Keep the courses information in the UI
      const studentWithCourses = {
        ...updatedStudent,
        cursos: newStudent.cursos,
      };

      setStudents((prev) =>
        prev.map((student) =>
          student.id === newStudent.id ? studentWithCourses : student
        )
      );

      toggleForm();
      setError(null);
    } catch (error) {
      setError("Error al actualizar estudiante: " + error.message);
      console.error("Error updating student:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await estudiantesApi.eliminar(selectedStudent.id);
      setStudents((prev) => prev.filter((e) => e.id !== selectedStudent.id));
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (error) {
      alert("Error al eliminar el estudiante: " + error.message);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };
  return (
    <div className="student-container">
      <div className="header-student">
        <h2>Gestión de Estudiantes</h2>
        <button className="btn-nuevo" onClick={toggleForm} disabled={loading}>
          + Nuevo Estudiante
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-message">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <div className="content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando estudiantes...</p>
          </div>
        ) : (
          <>
            {showForm && (
              <div className="student-modal-overlay">
                <div className="student-modal">
                  <div className="student-modal-header">
                    <h3 className="student-modal-title">
                      {editMode ? "Editar Estudiante" : "Nuevo Estudiante"}
                    </h3>
                    <button
                      className="student-modal-close"
                      onClick={toggleForm}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="modal-form-grid">
                    <div className="modal-form-full">
                      <input
                        name="nombres"
                        placeholder="Nombres"
                        value={newStudent.nombres}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div className="modal-form-full">
                      <input
                        name="apellidos"
                        placeholder="Apellidos"
                        value={newStudent.apellidos}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div className="modal-form-full">
                      <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={newStudent.email}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={newStudent.telefono}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={newStudent.password}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div className="modal-form-full">
                      <label htmlFor="cursos" className="select-label">
                        Cursos asignados:
                      </label>
                      <select
                        id="cursos"
                        name="cursos"
                        multiple
                        value={newStudent.cursos}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          setNewStudent({
                            ...newStudent,
                            cursos: selectedOptions,
                          });
                        }}
                        className="input-field"
                      >
                        {mockCourses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} ({course.level})
                          </option>
                        ))}
                      </select>
                      <small className="select-help">
                        Mantén presionado Ctrl (Cmd en Mac) para seleccionar
                        múltiples cursos
                      </small>
                    </div>
                    <div className="modal-action-buttons">
                      <button onClick={toggleForm} className="btn-cancel">
                        Cancelar
                      </button>
                      <button
                        onClick={editMode ? handleUpdate : handleCreate}
                        className="btn-crear"
                      >
                        {editMode ? "Guardar Cambios" : "Crear Estudiante"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <input
              type="text"
              placeholder="🔍 Buscar estudiantes..."
              className="input-busqueda"
            />
            {loading ? (
              <p>Cargando estudiantes...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <table className="tabla-estudiantes">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Cursos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((e) => (
                    <tr key={e.id}>
                      <td>
                        {e.nombres} {e.apellidos}
                      </td>
                      <td>{e.email}</td>
                      <td>{e.telefono}</td>
                      <td>
                        {e.cursos?.length > 0 ? (
                          <div className="curso-badges">
                            {e.cursos.map((courseId) => {
                              const course = mockCourses.find(
                                (c) => c.id === courseId
                              );
                              return course ? (
                                <span key={courseId} className="curso-badge">
                                  {course.title}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="no-courses">
                            Sin cursos asignados
                          </span>
                        )}
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
            )}
          </>
        )}
      </div>

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
