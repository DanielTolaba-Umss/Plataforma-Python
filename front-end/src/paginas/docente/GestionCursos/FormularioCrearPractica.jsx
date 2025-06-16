import React, { useState, useEffect } from "react";
//import "docente/estilos/Recursos.css";
import { useParams } from "react-router-dom";
import { Edit, Trash, X, Upload, CheckCircle2 } from "lucide-react";
import ErrorModal from "../../../componentes/comunes/ErrorModal";
import { practiceAPI } from "../../../api/practice";
import { testCasesAPI } from "../../../api/testCases";
import styles from "/src/paginas/docente/estilos/CrearQuiz.module.css";

const FormularioCrearPractica = () => {
  const { courseId } = useParams();
  // Modal states
  const [practiceData, setPracticeData] = useState({
    instrucciones: "",
    codigoInicial: "",
    solucionReferencia: "",
    restricciones: "",
    intentosMax: 3,
    leccionId: courseId,
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

  const handleEditarPractica = (practica) => {
    console.log("Editando práctica con ID:", practica.id);
    setPracticeData({
      instrucciones: practica.instrucciones,
      codigoInicial: practica.codigoInicial,
      solucionReferencia: practica.solucionReferencia,
      restricciones: practica.restricciones,
      intentosMax: practica.intentosMax,
      leccionId: practica.leccionId,
      id: practica.id,
      testCases: practica.testCases || [],
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
          (p) => Number(p.leccion?.id) === Number(courseId)
        );
        setPracticas(filtradas);
      } catch (error) {
        console.error("Error al cargar las prácticas:", error);
      }
    };

    fetchPracticas();
  }, [courseId]);

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

      // Asegurarse que el id esté presente
      if (modalMode === "editar" && !practiceData.id) {
        showError("❌ No se puede actualizar: Falta el ID de la práctica.");
        setLoading(false);
        return;
      }

      const practicePayload = {
        ...practiceData,
        // Se incluye explícitamente el ID
        id: practiceData.id,
      };
      delete practicePayload.testCases;

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
        setLoading(false);
        return;
      }

      for (const testCase of practiceData.testCases) {
        const testCasePayload = {
          entrada: `"${testCase.entrada.replaceAll('"', '\\"')}"`,
          salida: `"${testCase.salida.replaceAll('"', '\\"')}"`,
          practiceId: practiceId,
        };
        if (testCase.id) {
          await testCasesAPI.actualizar(testCase.id, testCasePayload);
        } else {
          await testCasesAPI.crear(testCasePayload);
        }
      }

      showNotification(
        `✅ Práctica ${
          modalMode === "editar" ? "actualizada" : "creada"
        } correctamente.`
      );
      resetPracticeForm();

      const refrescar = await practiceAPI.obtenerTodas();
      const filtradas = refrescar.data.filter(
        (p) => Number(p.leccionId) === Number(courseId)
      );
      setPracticas(filtradas);
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
        (p) => Number(p.leccionId) === Number(courseId)
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
      intentosMax: 3,
      leccionId: courseId,
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
      intentosMax: 3,
      leccionId: courseId,
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

      <h2 className="recursos-title">Práctica</h2>
      <div className="recursos-content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando practica...</p>
          </div>
        ) : (
          <>
            <div className="tabla-container">
              <div className="recursos-table">
                <div className="recursos-table-header">
                  <div>Nombre</div>
                  <div>Acciones</div>
                </div>
                {practicas.length > 0 ? (
                  practicas.map((practica) => (
                    <div key={practica.id} className="recursos-table-row">
                      <div>{practica.instrucciones?.slice(0, 40)}...</div>
                      <div className="action-buttons">
                        <button
                          className="recursos-button edit-button"
                          onClick={() => handleEditarPractica(practica)}
                          disabled={loading}
                          title="Editar práctica existente"
                        >
                          <Edit size={18} color="white" />
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
                    </div>
                  ))
                ) : (
                  <div className="recursos-table-row">
                    <div
                      style={{ textAlign: "center", gridColumn: "1 / span 3" }}
                    >
                      {loading ? "Cargando..." : "No hay prácticas disponibles"}
                    </div>
                  </div>
                )}
              </div>
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

                <div className="modal-form-full">
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
                </div>

                {/* Sección de Casos de Prueba */}
                <div className="modal-form-full">
                  <h4>Casos de Prueba</h4>

                  {/* Lista de test cases añadidos */}
                  {(practiceData.testCases || []).map((tc, index) => (
                    <div key={index} className="test-case-item">
                      <div>
                        <strong>Entrada:</strong> {tc.entrada}
                        <br />
                        <strong>Salida esperada:</strong> {tc.salida}
                        {tc.entradaTestCase && (
                          <>
                            <br />
                            <strong>Entrada para test:</strong>{" "}
                            {tc.entradaTestCase}
                          </>
                        )}
                      </div>
                      {/* <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="btn-eliminar"
                >
                  <Trash size={14} />
                </button> */}
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
                        required
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
