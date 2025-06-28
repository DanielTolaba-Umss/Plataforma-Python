import React, { useState, useEffect } from "react";
//import "docente/estilos/Recursos.css";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash, X, Upload, CheckCircle2 } from "lucide-react";
import ErrorModal from "../../../componentes/comunes/ErrorModal";
import { practiceAPI } from "../../../api/practice";
import { testCasesAPI } from "../../../api/testCases";
import styles from "/src/paginas/docente/estilos/CrearQuiz.module.css";

const FormularioCrearPractica = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  // Modal states
  const [practiceData, setPracticeData] = useState({
    instrucciones: "",
    codigoInicial: "",
    solucionReferencia: "",
    restricciones: "",
    intentosMax: 1, // Cambiado a 1 como valor por defecto
    leccionId: lessonId,
    testCases: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [practicaAEliminar, setPracticaAEliminar] = useState(null);
  const [modalMode, setModalMode] = useState("crear");
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [practicas, setPracticas] = useState([]);
  // Error state
  const [error, setError] = useState(null);
  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);
  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTestCase, setCurrentTestCase] = useState({
    entrada: "",
    salida: "",
  });

  const handleEditarPractica = async (practica) => {
    console.log("Editando práctica con ID:", practica.id);

    let testCasesFromBackend = [];
    try {
      const response = await testCasesAPI.obtenerPorPractice(practica.id);
      testCasesFromBackend = response.data;
    } catch (err) {
      console.error("Error al obtener los test cases:", err);
      showError("No se pudieron cargar los test cases de esta práctica.");
    }

    setPracticeData({
      instrucciones: practica.instrucciones,
      codigoInicial: practica.codigoInicial,
      solucionReferencia: practica.solucionReferencia,
      restricciones: practica.restricciones,
      intentosMax: practica.intentosMax,
      leccionId: practica.leccionId,
      id: practica.id,
      testCases: testCasesFromBackend,
    });

    setModalMode("editar");
    setShowPracticeModal(true);
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
    setError(null);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPracticaAEliminar(null);
  };

  //practica
  useEffect(() => {
    const fetchPracticas = async () => {
      try {
        const response = await practiceAPI.obtenerTodas();
        console.log(response.data);
        const filtradas = response.data.filter(
          (p) => Number(p.leccion?.id) === Number(lessonId)
        );
        setPracticas(filtradas);
      } catch (error) {
        console.error("Error al cargar las prácticas:", error);
      }
    };

    fetchPracticas();
  }, [lessonId]);

  const removeTestCase = (indexToRemove) => {
    setPracticeData((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validarTestCases = () => {
    const { testCases } = practiceData;
    if (!testCases || testCases.length === 0) {
      setErrorMessage("Debe agregar al menos un test case.");
      setShowErrorModal(true);
      return false;
    }
    for (const tc of testCases) {
      if (!tc.entrada?.trim() || !tc.salida?.trim()) {
        setErrorMessage("Todos los test cases deben tener entrada y salida.");
        setShowErrorModal(true);
        return false;
      }
    }
    return true;
  };

  const handleSubmitPractice = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setShowErrorModal(false);

    if (!validarTestCases()) return;
    setLoading(true);

    try {
      let response;

      if (modalMode === "editar" && !practiceData.id) {
        showError("❌ No se puede actualizar: Falta el ID de la práctica.");
        return;
      }

      const practicePayload = {
        instrucciones: practiceData.instrucciones,
        codigoInicial: practiceData.codigoInicial,
        solucionReferencia: practiceData.solucionReferencia,
        restricciones: practiceData.restricciones,
        intentosMax: practiceData.intentosMax,
        leccionId:
          practiceData.leccionId ?? practiceData.leccion?.id ?? lessonId,
      };

      if (modalMode === "editar") {
        response = await practiceAPI.actualizar(
          practiceData.id,
          practicePayload
        );
      } else {
        response = await practiceAPI.crear(practicePayload);
      }

      const practiceId = response?.id || response?.data?.id;
      if (!practiceId) {
        showError(
          "❌ La práctica no se guardó. El servidor no devolvió un ID."
        );
        return;
      }

      // Eliminar test cases antiguos si estás en modo editar
      if (modalMode === "editar") {
        try {
          const existentes = await testCasesAPI.obtenerPorPractice(practiceId);
          for (const tc of existentes.data) {
            await testCasesAPI.eliminar(tc.id);
          }
        } catch (err) {
          console.warn(
            "No se pudieron eliminar los test cases anteriores",
            err
          );
        }
      }

      // Crear test cases nuevos
      for (const testCase of practiceData.testCases) {
        const testCasePayload = {
          entrada: testCase.entrada,
          salida: testCase.salida,
          isPublic: testCase.isPublic || false,
          practiceId: practiceId,
        };
        await testCasesAPI.crear(testCasePayload);
      }

      // Actualizar prácticas en estado local
      const nuevaPractica = {
        ...practicePayload,
        id: practiceId,
        testCases: [...practiceData.testCases],
      };

      setPracticas((prev) => {
        const otras = prev.filter((p) => p.id !== practiceId);
        return [...otras, nuevaPractica];
      });

      showNotification(
        `✅ Práctica ${
          modalMode === "editar" ? "actualizada" : "creada"
        } correctamente.`
      );
      resetPracticeForm();
    } catch (error) {
      console.error("Error al guardar la práctica:", error);
      showError("❌ Error al guardar la práctica o test cases.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (practica) => {
    if (!practica || !practica.id) {
      console.error("❌ Error: práctica inválida para eliminar:", practica);
      return;
    }

    setShowDeleteModal(true);
    setPracticaAEliminar(practica); // puedes guardar el objeto completo
  };

  const confirmDelete = async () => {
    try {
      console.log("Objeto que se intenta eliminar:", practicaAEliminar);
      await practiceAPI.eliminar(practicaAEliminar.id);
      showNotification("✅ Práctica eliminada correctamente.");

      const refrescar = await practiceAPI.obtenerTodas();
      const filtradas = refrescar.data.filter(
        (p) => Number(p.leccionId) === Number(lessonId)
      );
      setPracticas(filtradas);
      setShowDeleteModal(false);
      setPracticaAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar práctica:", error);
      if (error.response) {
        showError(
          `❌ Error del servidor al eliminar: ${error.response.status} - ${
            error.response.data?.message || "Error desconocido"
          }`
        );
      } else if (error.request) {
        showError("❌ No se recibió respuesta del servidor al eliminar.");
      } else {
        showError(`❌ Error inesperado: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaPractica = () => {
    setPracticeData({
      instrucciones: "",
      codigoInicial: "",
      solucionReferencia: "",
      restricciones: "",
      intentosMax: 1, // Cambiado a 1
      leccionId: lessonId,
    });
    setShowPracticeModal(true);
  };

  const handlePracticeChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "intentosMax" ? parseInt(value) : value;
    setPracticeData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const resetPracticeForm = () => {
    setPracticeData({
      instrucciones: "",
      codigoInicial: "",
      solucionReferencia: "",
      restricciones: "",
      intentosMax: 1, // Cambiado a 1
      leccionId: lessonId,
    });
    setShowPracticeModal(false);
  };
  const handleTestCaseChange = (e) => {
    const { name, value } = e.target;
    setCurrentTestCase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTestCase = () => {
    if (currentTestCase.entrada && currentTestCase.salida) {
      setPracticeData((prev) => ({
        ...prev,
        testCases: [...(prev.testCases || []), { ...currentTestCase }],
      }));
    }

    setCurrentTestCase({
      entrada: "",
      salida: "",
    });
  };

  return (
    <div className="recursos">
      {/* Error Banner */}
      {error && (
        <div className="notification error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Notificación */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <CheckCircle2 size={20} />
          <span>{notification.message}</span>
        </div>
      )}
      {showDeleteModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal-content">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar la práctica?{" "}
              <strong>
                {practicaAEliminar?.instrucciones?.slice(0, 40) ||
                  "Práctica sin título"}
                ...
              </strong>
              ?
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="recursos-modal-actions">
              <button
                className="recursos-confirm-button"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                className="recursos-cancel-button"
                onClick={cancelDelete}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}

      <div className="recursos-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="recursos-title">Práctica</h2>
        <button
          onClick={() => navigate(`/gestion-curso/lecciones/${courseId}`)}
          className="recursos-back-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#0e2ed1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#057eef'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0e2ed1'}
        >
          Volver a lecciones
        </button>
      </div>
      <div className="recursos-content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando practica...</p>
          </div>
        ) : (
          <>
            <div className="tabla-container">
              <table className="recursos-table">
                <thead>
                  <tr className="recursos-table-header">
                    <th>Nombre</th>
                    <th></th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {practicas.length > 0 ? (
                    practicas.map((practica) => (
                      <tr key={practica.id} className="recursos-table-row">
                        <td>{practica.instrucciones?.slice(0, 40)}...</td>
                        <td></td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className={styles["boton-editar"]}
                              onClick={() => handleEditarPractica(practica)}
                              disabled={loading}
                              title="Editar práctica existente"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="action-button"
                              title="Eliminar"
                              onClick={() => openDeleteModal(practica)}
                              disabled={loading}
                            >
                              <Trash size={18} color="#300898" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="recursos-table-row">
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        {loading
                          ? "Cargando..."
                          : "No hay prácticas disponibles"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}{" "}
        <div className="recursos-button-container">
          <button
            className={`recursos-button ${
              practicas.length > 0 ? "disabled" : ""
            }`}
            onClick={handleNuevaPractica}
            disabled={loading || practicas.length > 0}
            title={
              practicas.length > 0
                ? "Ya hay una práctica asignado a esta lección"
                : "Subir nueva práctica"
            }
          >
            {practicas.length > 0 ? "Práctica ya asignada" : "Subir Practica"}
          </button>
        </div>
      </div>
      {showPracticeModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal">
            <div className="recursos-modal-header">
              <h3 className="recursos-modal-title">
                {modalMode === "crear" ? "Crear Práctica" : "Editar Práctica"}
              </h3>
            </div>

            <form onSubmit={handleSubmitPractice}>
              <div className="recursos-modal-form">
                {/* Campos principales de la práctica */}
                <div className="modal-form-full">
                  <label>Instrucciones:</label>
                  <textarea
                    name="instrucciones"
                    placeholder="Describe el ejercicio para el estudiante"
                    value={practiceData.instrucciones}
                    onChange={handlePracticeChange}
                    className="input-field"
                    rows="4"
                    required
                  />
                </div>

                <div className="modal-form-full">
                  <label>Código Inicial:</label>
                  <textarea
                    name="codigoInicial"
                    placeholder="Código base que recibirá el estudiante"
                    value={practiceData.codigoInicial}
                    onChange={handlePracticeChange}
                    className="input-field code-field"
                    rows="6"
                    required
                  />
                </div>

                <div className="modal-form-full">
                  <label>Solución de Referencia:</label>
                  <textarea
                    name="solucionReferencia"
                    placeholder="Solución correcta para comparar"
                    value={practiceData.solucionReferencia}
                    onChange={handlePracticeChange}
                    className="input-field code-field"
                    rows="6"
                    required
                  />
                </div>

                <div className="modal-form-full">
                  <label>Restricciones:</label>
                  <input
                    type="text"
                    name="restricciones"
                    placeholder="Ej: No usar bucles for"
                    value={practiceData.restricciones}
                    onChange={handlePracticeChange}
                    className="input-field"
                    required
                  />
                </div>

                {/* Campo de Intentos Máximos oculto - se mantiene el valor por defecto */}
                {/* <div className="modal-form-full">
                  <label>Intentos Máximos:</label>
                  <select
                    name="intentosMax"
                    value={practiceData.intentosMax}
                    onChange={handlePracticeChange}
                    className="input-field"
                    required
                  >
                    <option value="1">1 Intento</option>
                    <option value="2">2 Intentos</option>
                    <option value="3">3 Intentos</option>
                  </select>
                </div> */}

                {/* Sección de Casos de Prueba */}
                <div className="modal-form-full">
                  <h4>Casos de Prueba</h4>

                  {/* Lista de test cases añadidos */}
                  {(practiceData.testCases || []).map((tc, index) => (
                    <div key={index} className={styles.testCaseCard}>
                      <div className={styles.testCaseContent}>
                        <div>
                          <p>
                            <strong>Entrada:</strong> <code>{tc.entrada}</code>
                          </p>
                          <p>
                            <strong>Salida esperada:</strong>{" "}
                            <code>{tc.salida}</code>
                          </p>
                          {tc.isPublic && (
                            <p className={styles.publicLabel}>
                              Visible para estudiantes
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => removeTestCase(index)}
                          title="Eliminar este caso de prueba"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Formulario para añadir nuevo test case */}
                  <div className="test-case-form">
                    <h5>Añadir nuevo caso de prueba</h5>

                    <div className="input-group">
                      <label>Entrada:</label>
                      <textarea
                        name="entrada"
                        value={currentTestCase.entrada}
                        onChange={handleTestCaseChange}
                        placeholder="Datos de entrada"
                        rows="2"
                      />
                    </div>

                    <div className="input-group">
                      <label>Salida esperada:</label>
                      <textarea
                        name="salida"
                        value={currentTestCase.salida}
                        onChange={handleTestCaseChange}
                        placeholder="Salida esperada"
                        rows="2"
                        // required
                      />
                    </div>

                    <div className="input-group checkbox">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={currentTestCase.isPublic || false}
                        onChange={handleTestCaseChange}
                      />
                      <label>Visible para estudiantes</label>
                    </div>

                    <button
                      type="button"
                      className={styles.resourcesButton}
                      onClick={(e) => {
                        e.preventDefault();
                        addTestCase();
                      }}
                      disabled={
                        !currentTestCase.entrada || !currentTestCase.salida
                      }
                    >
                      Añadir Caso de Prueba
                    </button>
                  </div>
                </div>

                <div className="modal-action-buttons">
                  <button
                    type="submit"
                    className="btn-subir"
                    disabled={
                      !practiceData.instrucciones ||
                      !practiceData.codigoInicial ||
                      !practiceData.solucionReferencia ||
                      loading ||
                      practiceData.testCases?.length === 0
                    }
                  >
                    {loading
                      ? modalMode === "crear"
                        ? "Creando..."
                        : "Actualizando..."
                      : modalMode === "crear"
                      ? "Crear Práctica"
                      : "Actualizar Práctica"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={resetPracticeForm}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioCrearPractica;
