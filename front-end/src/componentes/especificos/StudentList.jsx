import React, { useState, useEffect } from "react";
import "../../estilos/StudentList.css";
import { Pencil, Trash, X, Search } from "lucide-react";
import DeleteModal from "../comunes/DeleteModal";
import { estudiantesApi } from "../../api/estudiantesService";

// Los datos iniciales ahora vendrán de la API

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStudent, setNewStudent] = useState({
    id: null,
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
  });  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargamos los estudiantes
        const estudiantesData = await estudiantesApi.listar();
        console.log("Datos de estudiantes:", estudiantesData);
        
        setStudents(estudiantesData);
      } catch (error) {
        setError("Error al cargar los datos: " + error.message);
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewStudent({
      id: null,
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
    });
  };

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // Función para manejar la búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar la búsqueda al presionar Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // La búsqueda se realiza automáticamente con filteredStudents
    }
  };

  // Función para limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = students.filter(student => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const fullName = `${student.nombres} ${student.apellidos}`.toLowerCase();
    const email = student.email.toLowerCase();
    
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const handleCreate = async () => {
    try {
      if (
        !newStudent.nombres ||
        !newStudent.email ||
        !newStudent.apellidos
      ) {
        alert(
          "Los campos Nombres, Apellidos y Email son obligatorios."
        );
        return;
      }      setLoading(true);      
      const studentData = {
        nombres: newStudent.nombres,
        apellidos: newStudent.apellidos,
        email: newStudent.email,
        telefono: newStudent.telefono || null,
      };

      console.log("Enviando datos al backend:", studentData);
      const createdStudent = await estudiantesApi.crear(studentData);
      console.log("Respuesta del backend al crear estudiante:", createdStudent);

      // Actualizar la lista de estudiantes
      setStudents(prev => [...prev, createdStudent]);
      
      toggleForm();
      setError(null);
    } catch (error) {
      setError("Error al crear estudiante: " + error.message);
      console.error("Error creating student:", error);
    } finally {
      setLoading(false);
    }
  };const handleEdit = (estudiante) => {
    setEditMode(true);
    setShowForm(true);
    setNewStudent({
      id: estudiante.id,
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos || "",
      email: estudiante.email,
      telefono: estudiante.telefono || "",
    });
  };  const handleUpdate = async () => {
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
      };

      console.log("Actualizando estudiante con datos:", studentData);
      const updatedStudent = await estudiantesApi.actualizar(
        newStudent.id,
        studentData
      );
      console.log("Respuesta del backend al actualizar estudiante:", updatedStudent);
      
      // Actualizar la lista de estudiantes
      setStudents(prev => {
        const newList = prev.map(student => 
          student.id === newStudent.id ? updatedStudent : student
        );
        console.log("Nueva lista de estudiantes después de actualizar:", newList);
        return newList;
      });

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
                <div className="student-modal">                  <div className="student-modal-header">
                    <h3 className="student-modal-title">
                      {editMode ? "Editar Estudiante" : "Nuevo Estudiante"}
                    </h3>
                  </div>                  <div className="modal-form-grid">
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
                    </div>                    <div className="modal-form-full">
                      <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={newStudent.telefono}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
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
            )}            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="input-busqueda"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
              />
              <button 
                className="search-button"
                onClick={handleClearSearch}
                title={searchTerm ? "Limpiar búsqueda" : "Buscar"}
              >
                {searchTerm ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>{loading ? (
              <p>Cargando estudiantes...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <table className="tabla-estudiantes">                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((e) => (
                      <tr key={e.id}>
                        <td>{e.nombres} {e.apellidos}</td>
                        <td>{e.email}</td>
                        <td>{e.telefono}</td>
                        <td className="acciones">
                          <Pencil size={18} className="accion editar" onClick={() => handleEdit(e)} />
                          <Trash size={18} className="accion eliminar" onClick={() => openDeleteModal(e)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                        {searchTerm ? 
                          `No se encontraron estudiantes que coincidan con "${searchTerm}"` : 
                          "No hay estudiantes registrados"
                        }
                      </td>
                    </tr>
                  )}
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
