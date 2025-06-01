import React, { useState, useEffect } from "react";
import "../../estilos/StudentList.css";
import { Pencil, Trash, X, Search, Upload } from "lucide-react";
import { estudiantesApi } from "../../api/estudiantesService";
import ErrorModal from "../../componentes/comunes/ErrorModal";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Los datos iniciales ahora vendrán de la API

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [newStudent, setNewStudent] = useState({
    id: null,
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
  });
  useEffect(() => {
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
    if (e.key === "Enter") {
      e.preventDefault();
      // La búsqueda se realiza automáticamente con filteredStudents
    }
  };

  // Función para limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = students.filter((student) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase().trim();
    const fullName = `${student.nombres} ${student.apellidos}`.toLowerCase();
    const email = student.email.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const handleCreate = async () => {
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

      console.log("Enviando datos al backend:", studentData);
      const createdStudent = await estudiantesApi.crear(studentData);
      console.log("Respuesta del backend al crear estudiante:", createdStudent);

      // Actualizar la lista de estudiantes
      setStudents((prev) => [...prev, createdStudent]);

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
      };

      console.log("Actualizando estudiante con datos:", studentData);
      const updatedStudent = await estudiantesApi.actualizar(
        newStudent.id,
        studentData
      );
      console.log(
        "Respuesta del backend al actualizar estudiante:",
        updatedStudent
      );

      // Actualizar la lista de estudiantes
      setStudents((prev) => {
        const newList = prev.map((student) =>
          student.id === newStudent.id ? updatedStudent : student
        );
        console.log(
          "Nueva lista de estudiantes después de actualizar:",
          newList
        );
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
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await estudiantesApi.eliminar(studentToDelete.id);
      setStudents((prev) => prev.filter((e) => e.id !== studentToDelete.id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      alert("Error al eliminar el estudiante: " + error.message);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  // Funciones para subir lista de estudiantes
  const toggleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
    setUploadFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "text/csv" || file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      setUploadFile(file);
    } else {
      alert("Por favor selecciona un archivo CSV o Excel válido");
      e.target.value = "";
    }
  };
  // Función para procesar archivos CSV
  const processCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`Error al procesar CSV: ${results.errors[0].message}`));
            return;
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`Error al leer CSV: ${error.message}`));
        }
      });
    });
  };

  // Función para procesar archivos XLSX
  const processXLSXFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('El archivo Excel está vacío'));
            return;
          }

          // Convertir a formato con headers
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          const processedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });

          resolve(processedData);
        } catch (error) {
          reject(new Error(`Error al procesar Excel: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Función para validar y normalizar datos de estudiantes
  const validateAndNormalizeStudentData = (rawData) => {
    const validStudents = [];
    const errors = [];

    rawData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 porque empezamos desde la fila 2 (después del header)
      
      // Buscar las columnas necesarias (flexibilidad en nombres de columnas)
      const findColumn = (possibleNames) => {
        for (const name of possibleNames) {
          const key = Object.keys(row).find(k => 
            k.toLowerCase().trim().includes(name.toLowerCase())
          );
          if (key && row[key]) return row[key].toString().trim();
        }
        return '';
      };

      const nombres = findColumn(['nombres', 'nombre', 'first_name', 'firstname']);
      const apellidos = findColumn(['apellidos', 'apellido', 'last_name', 'lastname']);
      const email = findColumn(['email', 'correo', 'mail', 'e-mail']);
      const telefono = findColumn(['telefono', 'teléfono', 'phone', 'tel', 'celular']);

      // Validaciones
      if (!nombres) {
        errors.push(`Fila ${rowNumber}: Falta el nombre`);
        return;
      }
      if (!apellidos) {
        errors.push(`Fila ${rowNumber}: Faltan los apellidos`);
        return;
      }
      if (!email) {
        errors.push(`Fila ${rowNumber}: Falta el email`);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Fila ${rowNumber}: Email inválido (${email})`);
        return;
      }

      // Verificar duplicados en el archivo
      const isDuplicate = validStudents.some(s => s.email.toLowerCase() === email.toLowerCase());
      if (isDuplicate) {
        errors.push(`Fila ${rowNumber}: Email duplicado en el archivo (${email})`);
        return;
      }

      validStudents.push({
        nombres,
        apellidos,
        email,
        telefono: telefono || null
      });
    });

    return { validStudents, errors };
  };

  // Función para crear estudiantes en lotes
  const createStudentsInBatches = async (students) => {
    const batchSize = 5; // Crear de a 5 estudiantes para no sobrecargar el servidor
    const results = {
      created: [],
      errors: []
    };

    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize);
      
      // Procesar el lote actual
      const promises = batch.map(async (student, batchIndex) => {
        try {
          const created = await estudiantesApi.crear(student);
          results.created.push({ ...student, id: created.id });
          return created;
        } catch (error) {
          const globalIndex = i + batchIndex + 1;
          results.errors.push(`Estudiante ${globalIndex} (${student.email}): ${error.message}`);
          return null;
        }
      });

      await Promise.all(promises);
      
      // Pequeña pausa entre lotes para no saturar el servidor
      if (i + batchSize < students.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Por favor selecciona un archivo");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Procesando archivo:", uploadFile.name);

      // Procesar el archivo según su tipo
      let rawData;
      const fileExtension = uploadFile.name.toLowerCase().split('.').pop();
      
      if (fileExtension === 'csv') {
        rawData = await processCSVFile(uploadFile);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        rawData = await processXLSXFile(uploadFile);
      } else {
        throw new Error('Formato de archivo no soportado. Use CSV o Excel.');
      }

      console.log("Datos procesados:", rawData);

      if (rawData.length === 0) {
        throw new Error('El archivo no contiene datos válidos');
      }

      // Validar y normalizar los datos
      const { validStudents, errors } = validateAndNormalizeStudentData(rawData);

      if (errors.length > 0 && validStudents.length === 0) {
        throw new Error(`Errores en el archivo:\n${errors.join('\n')}`);
      }

      if (validStudents.length === 0) {
        throw new Error('No se encontraron estudiantes válidos en el archivo');
      }

      // Verificar duplicados con estudiantes existentes
      const existingEmails = students.map(s => s.email.toLowerCase());
      const duplicateStudents = validStudents.filter(s => 
        existingEmails.includes(s.email.toLowerCase())
      );

      if (duplicateStudents.length > 0) {
        const duplicateList = duplicateStudents.map(s => s.email).join(', ');
        const proceed = window.confirm(
          `Los siguientes emails ya existen en el sistema:\n${duplicateList}\n\n¿Desea continuar con los estudiantes restantes?`
        );
        
        if (!proceed) {
          setLoading(false);
          return;
        }

        // Filtrar estudiantes duplicados
        const filteredStudents = validStudents.filter(s => 
          !existingEmails.includes(s.email.toLowerCase())
        );
        
        if (filteredStudents.length === 0) {
          throw new Error('Todos los estudiantes en el archivo ya existen en el sistema');
        }
        
        validStudents.splice(0, validStudents.length, ...filteredStudents);
      }

      console.log(`Creando ${validStudents.length} estudiantes...`);

      // Crear estudiantes en lotes
      const results = await createStudentsInBatches(validStudents);

      // Mostrar resultados
      let message = '';
      if (results.created.length > 0) {
        message += `✅ ${results.created.length} estudiantes creados exitosamente`;
      }
      if (results.errors.length > 0) {
        message += `\n\n❌ ${results.errors.length} errores:\n${results.errors.slice(0, 5).join('\n')}`;
        if (results.errors.length > 5) {
          message += `\n... y ${results.errors.length - 5} errores más`;
        }
      }
      if (errors.length > 0) {
        message += `\n\n⚠️ ${errors.length} filas con problemas de formato:\n${errors.slice(0, 3).join('\n')}`;
        if (errors.length > 3) {
          message += `\n... y ${errors.length - 3} más`;
        }
      }

      alert(message);

      // Actualizar la lista si se crearon estudiantes
      if (results.created.length > 0) {
        setStudents(prev => [...prev, ...results.created]);
      }

      toggleUploadModal();
      
    } catch (error) {
      console.error("Error al procesar archivo ya que no contiene los campos necesarios", error);
      setError("Error al procesar archivo ya que no contiene los campos necesarios " );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      setUploadFile(file);
    } else {
      alert("Por favor selecciona un archivo CSV o Excel válido");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  return (
    <div className="student-container">      <div className="header-student">
        <h2>Gestión de Estudiantes</h2>
        <div className="header-buttons">
          <button className="btn-upload" onClick={toggleUploadModal} disabled={loading}>
            <Upload size={18} />
            Subir Lista
          </button>
          <button className="btn-nuevo" onClick={toggleForm} disabled={loading}>
            + Nuevo Estudiante
          </button>
        </div>
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
                  {" "}
                  <div className="student-modal-header">
                    <h3 className="student-modal-title">
                      {editMode ? "Editar Estudiante" : "Nuevo Estudiante"}
                    </h3>
                  </div>{" "}
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
                    </div>{" "}
                    <div className="modal-form-full">
                      <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={newStudent.telefono}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>{" "}
                  <div className="modal-action-buttons">
                    <button
                      onClick={editMode ? handleUpdate : handleCreate}
                      className="btn-crear"
                    >
                      {editMode ? "Guardar Cambios" : "Crear Estudiante"}
                    </button>
                    <button onClick={toggleForm} className="btn-cancel">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}{" "}
            <div className="search-container">
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
            </div>
            {loading ? (
              <p>Cargando estudiantes...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <table className="tabla-estudiantes">
                {" "}
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>{" "}
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((e) => (
                      <tr key={e.id}>
                        <td>
                          {e.nombres} {e.apellidos}
                        </td>
                        <td>{e.email}</td>
                        <td>{e.telefono}</td>{" "}
                        <td className="acciones">
                          <button
                            className="accion editar"
                            onClick={() => handleEdit(e)}
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="accion eliminar"
                            onClick={() => openDeleteModal(e)}
                            title="Eliminar"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#6b7280",
                        }}
                      >
                        {searchTerm
                          ? `No se encontraron estudiantes que coincidan con "${searchTerm}"`
                          : "No hay estudiantes registrados"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}{" "}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar al estudiante{" "}
              <strong>
                {studentToDelete?.nombres} {studentToDelete?.apellidos}
              </strong>
              ?
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="modalActions">
              <button className="confirmButton" onClick={confirmDelete}>
                Eliminar
              </button>
              <button className="cancelButton" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
